import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppointmentBooking } from '../types';

// Supabase Project Credentials provided by user
export const SUPABASE_PROJECT_ID = 'rhudlrxuogviylnfrbgs';
export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_3DSDOYvG6rxe2JAOrIQf5g_JOz37n00';

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/rhudlrxuogviylnfrbgs/sql)
export const SUPABASE_TABLE_SQL = `-- 1. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    student_college TEXT,
    mentor_name TEXT NOT NULL,
    session_type TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'confirmed'
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can insert appointments" ON public.appointments;
CREATE POLICY "Public can insert appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view appointments" ON public.appointments;
CREATE POLICY "Public can view appointments" ON public.appointments FOR SELECT TO anon, authenticated USING (true);

-- 2. ALL COLLEGES STUDENTS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    college TEXT NOT NULL,
    degree TEXT,
    branch TEXT,
    academic_year INT,
    city TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb,
    goals JSONB DEFAULT '[]'::jsonb,
    bio TEXT
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view students" ON public.students;
CREATE POLICY "Public can view students" ON public.students FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert students" ON public.students;
CREATE POLICY "Public can insert students" ON public.students FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update students" ON public.students;
CREATE POLICY "Public can update students" ON public.students FOR UPDATE TO anon, authenticated USING (true);
`;

const LOCAL_STORAGE_APPOINTMENTS_KEY = 'cc_supabase_appointments';

// Helper to get local cache
function getLocalAppointments(): AppointmentBooking[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to save local cache
function saveLocalAppointment(item: AppointmentBooking) {
  try {
    const list = getLocalAppointments();
    list.unshift(item);
    localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to cache appointment locally', e);
  }
}

/**
 * Save an appointment booking directly to Supabase
 */
export async function createAppointmentBooking(booking: Omit<AppointmentBooking, 'id' | 'created_at'>): Promise<{
  success: boolean;
  data?: AppointmentBooking;
  error?: string;
  source: 'supabase' | 'local';
  tableMissing?: boolean;
}> {
  const localRecord: AppointmentBooking = {
    ...booking,
    id: `app-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: booking.status || 'confirmed',
  };

  try {
    // Attempt Supabase insert
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          full_name: booking.full_name,
          email: booking.email,
          phone: booking.phone || null,
          student_college: booking.student_college || null,
          mentor_name: booking.mentor_name,
          session_type: booking.session_type,
          appointment_date: booking.appointment_date,
          appointment_time: booking.appointment_time,
          notes: booking.notes || null,
          status: booking.status || 'confirmed',
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert warning:', error.message, error);
      // Cache locally so user doesn't lose data
      saveLocalAppointment(localRecord);

      const isTableMissing =
        error.message?.includes('does not exist') ||
        error.message?.includes('relation "public.appointments" does not exist') ||
        error.code === '42P01';

      return {
        success: true, // Saved locally with warning
        data: localRecord,
        error: isTableMissing
          ? `Connected to Supabase (${SUPABASE_PROJECT_ID}), but the 'appointments' table needs to be created in your Supabase SQL editor.`
          : `Supabase insert note: ${error.message}. Saved safely in local session!`,
        source: 'local',
        tableMissing: isTableMissing,
      };
    }

    // Success in Supabase!
    saveLocalAppointment(data as AppointmentBooking);
    return {
      success: true,
      data: data as AppointmentBooking,
      source: 'supabase',
    };
  } catch (err: any) {
    console.error('Supabase network error:', err);
    saveLocalAppointment(localRecord);
    return {
      success: true,
      data: localRecord,
      error: `Network warning: ${err?.message || 'Saved in local database'}.`,
      source: 'local',
    };
  }
}

/**
 * Fetch all booked appointments from Supabase (with fallback to local)
 */
export async function getAppointmentsList(): Promise<{
  appointments: AppointmentBooking[];
  source: 'supabase' | 'local';
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return {
        appointments: data as AppointmentBooking[],
        source: 'supabase',
      };
    }
  } catch (e) {
    console.warn('Failed to fetch from Supabase, loading cache', e);
  }

  // Fallback to local cache
  const localList = getLocalAppointments();
  return {
    appointments: localList,
    source: 'local',
  };
}

/**
 * Test connectivity with Supabase project
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  projectUrl: string;
  projectId: string;
}> {
  try {
    // Try pinging public endpoint
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      return {
        connected: true,
        message: 'Successfully reached Supabase API endpoint.',
        projectUrl: SUPABASE_URL,
        projectId: SUPABASE_PROJECT_ID,
      };
    }

    return {
      connected: false,
      message: `Supabase responded with status: ${res.status}`,
      projectUrl: SUPABASE_URL,
      projectId: SUPABASE_PROJECT_ID,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Failed to connect to Supabase.',
      projectUrl: SUPABASE_URL,
      projectId: SUPABASE_PROJECT_ID,
    };
  }
}

/**
 * Sync registered student from any college to Supabase database
 */
export async function syncStudentToSupabase(studentData: {
  id: string;
  name: string;
  email: string;
  college: string;
  degree?: string;
  branch?: string;
  year?: number;
  city?: string;
  skills?: any[];
  interests?: string[];
  goals?: string[];
  bio?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('students').upsert(
      [
        {
          id: studentData.id,
          full_name: studentData.name,
          email: studentData.email,
          college: studentData.college,
          degree: studentData.degree || 'B.E. / B.Tech',
          branch: studentData.branch || 'Engineering',
          academic_year: studentData.year || 2,
          city: studentData.city || 'Bangalore',
          skills: studentData.skills || [],
          interests: studentData.interests || [],
          goals: studentData.goals || [],
          bio: studentData.bio || null,
        },
      ],
      { onConflict: 'email' }
    );

    if (error) {
      console.warn('Supabase student sync warning (non-fatal):', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase student sync exception:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch students registered from all colleges from Supabase
 */
export async function getSupabaseStudents(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Could not read Supabase students table:', e);
  }
  return [];
}


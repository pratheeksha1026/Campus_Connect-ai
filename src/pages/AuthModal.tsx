import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, User, GraduationCap, MapPin, CheckCircle2, Building, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { syncStudentToSupabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess: () => void;
}

export const ALL_COLLEGES_LIST = [
  'National Institute of Engineering (NIE), Mysuru',
  'Sri Jayachamarajendra College of Engineering (SJCE / JSS STU), Mysuru',
  'PES University, Bangalore',
  'RV College of Engineering (RVCE), Bangalore',
  'BMS College of Engineering (BMSCE), Bangalore',
  'M.S. Ramaiah Institute of Technology (MSRIT), Bangalore',
  'Indian Institute of Science (IISc), Bangalore',
  'Indian Institute of Technology (IIT), Bombay',
  'Indian Institute of Technology (IIT), Delhi',
  'Indian Institute of Technology (IIT), Madras',
  'Indian Institute of Technology (IIT), Kharagpur',
  'Indian Institute of Technology (IIT), Roorkee',
  'National Institute of Technology Karnataka (NITK), Surathkal',
  'National Institute of Technology (NIT), Trichy',
  'National Institute of Technology (NIT), Warangal',
  'BITS Pilani (Pilani, Goa, Hyderabad)',
  'Manipal Institute of Technology (MIT), Manipal',
  'COEP Technological University, Pune',
  'Vellore Institute of Technology (VIT), Vellore',
  'SRM Institute of Science and Technology, Chennai',
  'PSG College of Technology, Coimbatore',
  'Delhi Technological University (DTU), New Delhi',
  'Netaji Subhas University of Technology (NSUT), Delhi',
  'Thapar Institute of Engineering and Technology, Patiala',
  'Amrita Vishwa Vidyapeetham, Coimbatore / Bangalore',
  'International Institute of Information Technology (IIIT), Hyderabad',
  'International Institute of Information Technology (IIIT), Bangalore',
  'Other / Enter Custom College or University Name',
];

export const BRANCHES_LIST = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Cybersecurity & Network Systems',
  'Robotics & Automation',
  'Biotechnology / Biomedical',
  'Chemical Engineering',
  'Other Engineering / Sciences Discipline',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  onSuccess,
}) => {
  const { register, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(ALL_COLLEGES_LIST[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [degree, setDegree] = useState('B.E.');
  const [branch, setBranch] = useState(BRANCHES_LIST[0]);
  const [year, setYear] = useState<number>(2);
  const [city, setCity] = useState('Bangalore');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const ok = login(email);
      if (ok) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg('No account found with this email. Please register or use a demo account.');
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return;
      }

      const finalCollege =
        selectedCollege.startsWith('Other')
          ? customCollege.trim() || 'Engineering College'
          : selectedCollege;

      setIsSubmitting(true);

      const newUser = register({
        name: fullName.trim() || 'New Student',
        email: email.trim().toLowerCase(),
        city: city.trim(),
        education: {
          college: finalCollege,
          degree: degree.trim(),
          branch: branch.trim(),
          year: Number(year),
        },
        skills: [
          { name: 'Python', level: 'Intermediate', yearsOfExp: 1 },
          { name: 'JavaScript', level: 'Intermediate', yearsOfExp: 1 },
          { name: 'SQL', level: 'Beginner', yearsOfExp: 1 },
        ],
        interests: ['AI', 'Hackathons', 'Gaming', 'Web Development'],
        connectionGoals: ['Find hackathon teammates', 'Make friends', 'Project partners'],
      });

      // Sync student to Supabase
      try {
        await syncStudentToSupabase({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          college: finalCollege,
          degree: newUser.education.degree,
          branch: newUser.education.branch,
          year: newUser.education.year,
          city: newUser.city,
          skills: newUser.skills,
          interests: newUser.interests,
          goals: newUser.connectionGoals,
        });
      } catch (err) {
        console.warn('Supabase sync note:', err);
      }

      setIsSubmitting(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {mode === 'register' ? 'Join from Any College / University' : 'Welcome Back Student'}
              </h2>
              <p className="text-[11px] text-slate-400">Open to students across all campuses & disciplines</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu or personal email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* College Selection from All Colleges Directory */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Your College / University</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-normal">All campuses supported</span>
                </label>
                <select
                  value={selectedCollege}
                  onChange={e => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {ALL_COLLEGES_LIST.map(col => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>

                {selectedCollege.startsWith('Other') && (
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={customCollege}
                      onChange={e => setCustomCollege(e.target.value)}
                      placeholder="Enter your college / university name..."
                      className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/50 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Branch, Degree, Year & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Major</label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {BRANCHES_LIST.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                  <select
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior)</option>
                    <option value={5}>5th Year / Masters / PhD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Degree</label>
                  <select
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="B.E.">B.E.</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.S.">M.S.</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Bangalore, Mysuru, Pune"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Student Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. pratheekshap606@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Registering & Connecting to Supabase...</span>
              </>
            ) : (
              <span>{mode === 'register' ? 'Register & Enter CampusConnect' : 'Sign In to CampusConnect'}</span>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
          {mode === 'register' ? (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New student from any college?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

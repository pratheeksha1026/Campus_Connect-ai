import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  ShieldCheck,
  Building,
  GraduationCap,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  CheckCircle2,
  Database,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_COLLEGES_LIST, BRANCHES_LIST } from './AuthModal';
import { syncStudentToSupabase } from '../services/supabase';

export const AuthLandingPage: React.FC = () => {
  const { login, register, allUsers, switchPersona } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(ALL_COLLEGES_LIST[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [branch, setBranch] = useState(BRANCHES_LIST[0]);
  const [degree, setDegree] = useState('B.E.');
  const [year, setYear] = useState<number>(2);
  const [city, setCity] = useState('Mysuru');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'login') {
      const ok = login(email);
      if (!ok) {
        setErrorMsg('No registered student found with this email. Please check spelling or create a new account.');
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
        interests: ['AI', 'Hackathons', 'Web Development', 'Robotics'],
        connectionGoals: ['Find hackathon teammates', 'Make college friends', 'Project collaboration'],
      });

      // Sync to Supabase cloud
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-black tracking-tight text-white">
            CampusConnect <span className="text-indigo-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-College Live Network</span>
          </span>
        </div>
      </header>

      {/* Main Hero & Auth Split Layout (Instagram style) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Platform Value & Live Highlights */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>For Engineering Students Nationwide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Connect with classmates, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">find hackathon partners</span>, and build your circle.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Create your own student profile. Match with peers based on tech skills, form complementary hackathon teams, and collaborate across any university campus.
            </p>

            {/* Micro Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <Users className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white">Your Real Friends</h4>
                <p className="text-[11px] text-slate-400">Your own private connections & chats.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">Zero Scams</h4>
                <p className="text-[11px] text-slate-400">Verified student directory & anti-spam.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                <Database className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">Supabase Cloud</h4>
                <p className="text-[11px] text-slate-400">Database synchronization active.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Instagram/LinkedIn-Style Sign Up & Sign In Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Tab Selector: Register vs Login */}
              <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create New Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {activeTab === 'register' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="your.email@college.edu or gmail"
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
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Select College */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Select Your College / University</span>
                        </span>
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
                        <input
                          type="text"
                          required
                          value={customCollege}
                          onChange={e => setCustomCollege(e.target.value)}
                          placeholder="Type your college name..."
                          className="w-full mt-2 px-3 py-2 bg-slate-950 border border-indigo-500/50 rounded-xl text-xs text-white focus:outline-none"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Branch</label>
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
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
                        <select
                          value={year}
                          onChange={e => setYear(Number(e.target.value))}
                          className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                        >
                          <option value={1}>1st Year</option>
                          <option value={2}>2nd Year</option>
                          <option value={3}>3rd Year</option>
                          <option value={4}>4th Year</option>
                          <option value={5}>Postgrad / PhD</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Registered Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="your.email@college.edu or gmail"
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
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Profile & Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>{activeTab === 'register' ? 'Sign Up & Enter App' : 'Sign In to Your Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo / Guest Tester Dropdown */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDemoSelector(!showDemoSelector)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer py-1"
                >
                  <span>Quick Demo Testing (Optional)</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoSelector ? 'rotate-180' : ''}`} />
                </button>

                {showDemoSelector && (
                  <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Want to test peer features immediately as a sample persona?
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {allUsers.slice(0, 4).map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => switchPersona(u.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left cursor-pointer transition"
                        >
                          <div className="font-bold text-white truncate">{u.name}</div>
                          <div className="text-[10px] text-indigo-400 truncate">{u.skills[0]?.name || 'Student'}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500">
        CampusConnect AI © {new Date().getFullYear()} • Student Collaboration Network & Hackathon Match Engine
      </footer>
    </div>
  );
};

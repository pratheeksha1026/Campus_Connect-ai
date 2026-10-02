import React from 'react';
import {
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Heart,
  Layers,
  FileText,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenArchitecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenArchitecture,
}) => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Student Networking & Team Formation</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
          Find Your People.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-300 bg-clip-text text-transparent">
            Build Your Team.
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 font-medium tracking-normal">
          Create Something Together.
        </p>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Connect with college students who share your interests, complement your technical skills, and help you build hackathon-winning prototypes and meaningful open-source projects.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <span>Enter CampusConnect</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenArchitecture}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>View Architecture Blueprint</span>
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xl font-black text-indigo-400">3 Modes</span>
            <p className="text-xs text-slate-400 mt-0.5">Friend, Skill & Team match engines</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xl font-black text-emerald-400">8 Factors</span>
            <p className="text-xs text-slate-400 mt-0.5">Weighted explainable AI score</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xl font-black text-sky-400">NLP Parser</span>
            <p className="text-xs text-slate-400 mt-0.5">Resume skill & education extraction</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xl font-black text-amber-400">100% Safe</span>
            <p className="text-xs text-slate-400 mt-0.5">Privacy toggles & approx geoloc</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">The Core Flow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            How CampusConnect AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            The platform is not another social clone. It uses explainable machine intelligence to uncover real synergy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Student Profile',
              desc: 'Education, branch, year, hobbies, goals, and portfolio links.',
              icon: Users,
              color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
            },
            {
              step: '02',
              title: 'Resume AI Extraction',
              desc: 'NLP extracts skills and projects. Review and confirm before applying.',
              icon: FileText,
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            },
            {
              step: '03',
              title: 'AI Matching Engine',
              desc: 'Calculates overall score and generates transparent "Why you match" reasons.',
              icon: Sparkles,
              color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
            },
            {
              step: '04',
              title: 'Connect & Chat',
              desc: 'Send requests, accept peers, and start real-time direct chats.',
              icon: MessageSquare,
              color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
            },
            {
              step: '05',
              title: 'Build Team',
              desc: 'AI recommends multi-disciplinary rosters for hackathons and projects.',
              icon: Zap,
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-500 font-mono">STEP {item.step}</span>
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Matching Modes Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Differentiator</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Three Distinct Matching Engines
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Tailor recommendations based on what you are looking for right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Friend Match */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 relative group hover:border-rose-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Mode A</span>
            <h3 className="text-lg font-bold text-white mt-1">Friend Match</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Find students outside your immediate circle based on lifestyle hobbies: movies, music, gaming, sports, photography, travel, and campus events.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Same city & college proximity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Overlapping gaming, music & film tastes</span>
              </div>
            </div>
          </div>

          {/* Skill Match */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 relative group hover:border-indigo-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Mode B</span>
            <h3 className="text-lg font-bold text-white mt-1">Skill Match</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Find students with complementary technical skills. If you know Python & Machine Learning, find peers skilled in React, Tailwind, and Backend.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Complementary skill pairing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verified GitHub & portfolio links</span>
              </div>
            </div>
          </div>

          {/* Team Match */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 relative group hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Flagship Feature</span>
            <h3 className="text-lg font-bold text-white mt-1">Team Match</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Create a hackathon or capstone project spec with required skills. The AI discovers a balanced team roster with assigned roles and compatibility rating.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated role assignment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skill gap and coverage analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Explainability Demo Preview Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Explainable Match Preview
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                "Why do we match?"
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                No black-box algorithms. CampusConnect breaks down every match across 8 weighted criteria with clear, human-readable insights.
              </p>
              <div className="space-y-1.5 text-xs text-slate-200 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✓ Same city (Mysuru) • 100% Location Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✓ 4 shared interests (AI, Hackathons, Gaming, Movies)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>✓ Complementary: You provide ML & Python, they bring React & UI/UX</span>
                </div>
              </div>
            </div>

            {/* Score Radial Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 w-full sm:w-56">
              <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                93%
              </div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-1">High Compatibility</div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Skills: 90% • Interests: 100% • Goals: 90%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="text-center max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Ready to build something meaningful?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Join your engineering peers, discover complementary teammates, and start collaborating today.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

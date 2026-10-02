import React from 'react';
import {
  X,
  Sparkles,
  MapPin,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Github,
  Linkedin,
  Globe,
  UserPlus,
  MessageSquare,
  ShieldAlert,
  Layers,
  Heart,
  Briefcase,
  Calendar
} from 'lucide-react';
import { User, MatchResult, ConnectionStatus } from '../types';

interface MatchDetailsModalProps {
  user: User;
  matchResult: MatchResult;
  currentUser: User;
  connectionStatus: ConnectionStatus;
  onClose: () => void;
  onConnect: (userId: string) => void;
  onOpenChat: (userId: string) => void;
  onReport: (userId: string) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  user,
  matchResult,
  currentUser,
  connectionStatus,
  onClose,
  onConnect,
  onOpenChat,
  onReport,
}) => {
  const { overallScore, factors, commonSkills, commonInterests, complementarySkills, differences, detailedReasons } = matchResult;

  const factorItems = [
    { label: 'Skills & Tech Complementarity', score: factors.skillsScore, color: 'bg-indigo-500' },
    { label: 'Common Interests & Hobbies', score: factors.interestsScore, color: 'bg-rose-500' },
    { label: 'Geographic Proximity', score: factors.locationScore, color: 'bg-emerald-500' },
    { label: 'Educational Discipline', score: factors.educationScore, color: 'bg-sky-500' },
    { label: 'Project & Collaboration Goals', score: factors.projectGoalsScore, color: 'bg-amber-500' },
    { label: 'Hackathon Intent Alignment', score: factors.hackathonScore, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&fit=crop&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user.education.year}rd Year
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user.education.branch} • {user.education.college}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{user.city}</span>
                {user.approxLocation?.area && <span>({user.approxLocation.area})</span>}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Overall Match Score Banner */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-800/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Compatibility Engine
              </div>
              <p className="text-sm text-slate-200 mt-1 font-medium">
                {matchResult.matchSummary}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <span className="text-3xl font-black bg-gradient-to-r from-indigo-300 via-white to-sky-300 bg-clip-text text-transparent">
                {overallScore}%
              </span>
              <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Overall Match</div>
            </div>
          </div>

          {/* Factor Breakdown Bars */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Compatibility Factor Breakdown
            </h3>
            <div className="space-y-2.5">
              {factorItems.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
                    <span>{item.label}</span>
                    <span className="font-bold text-slate-200">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable Insights: Common, Complementary & Differences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Ground */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Shared Common Ground
              </div>
              {commonSkills.length > 0 && (
                <div className="mb-2">
                  <span className="text-[11px] text-slate-400 block mb-1">Common Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {commonSkills.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {commonInterests.length > 0 && (
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Shared Interests:</span>
                  <div className="flex flex-wrap gap-1">
                    {commonInterests.map(i => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-700 text-slate-300 rounded font-medium">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Complementary Synergy */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> Complementary Synergy
              </div>
              <div className="text-xs text-slate-300 space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">They provide:</span>
                  <span className="font-semibold text-indigo-300">
                    {complementarySkills.theyProvide.join(', ') || 'Specialized domain expertise'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">You offer:</span>
                  <span className="font-semibold text-slate-200">
                    {complementarySkills.youProvide.join(', ') || 'Complementary skill coverage'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Reasoning Points */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2">Why the AI Recommends This Connection:</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {detailedReasons.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-indigo-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
              {differences.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-amber-200/80">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* External Verified Profiles */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Verified External Profiles
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>View LinkedIn</span>
                </a>
              )}
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub</span>
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400 border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio Site</span>
                </a>
              )}
              {!user.linkedinUrl && !user.githubUrl && (
                <p className="text-xs text-slate-500 italic">No external social links added.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onReport(user.id)}
            className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Report or Block</span>
          </button>

          <div className="flex items-center gap-2">
            {connectionStatus === 'ACCEPTED' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(user.id);
                }}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start Direct Chat</span>
              </button>
            ) : connectionStatus === 'PENDING_SENT' ? (
              <span className="py-2 px-3 text-xs text-amber-300 bg-amber-500/10 rounded-xl border border-amber-500/20 font-medium">
                Connection Request Pending
              </span>
            ) : (
              <button
                onClick={() => {
                  onConnect(user.id);
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Send Connection Request</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  CheckCircle2,
  Briefcase,
  Layers,
  MapPin,
  ExternalLink,
  Calendar,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { calculateMatchScore } from '../services/aiMatching';
import { MatchResult, User } from '../types';

interface DashboardPageProps {
  setCurrentTab: (tab: string) => void;
  onViewMatchDetails: (user: User, matchResult: MatchResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setCurrentTab,
  onViewMatchDetails,
}) => {
  const { currentUser, allUsers, refreshState } = useAuth();

  // Compute profile completeness
  let completeness = 40;
  if (currentUser.skills.length >= 4) completeness += 20;
  if (currentUser.interests.length >= 3) completeness += 15;
  if (currentUser.linkedinUrl || currentUser.githubUrl) completeness += 15;
  if (currentUser.bio) completeness += 10;
  completeness = Math.min(100, completeness);

  // Compute top recommended matches
  const matchCandidates = allUsers
    .filter(u => u.id !== currentUser.id && !u.isSuspended)
    .map(u => calculateMatchScore(currentUser, u, 'SKILL_MATCH'))
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  // Get active teams where current user is a member
  const myTeams = storage.getTeams().filter(t =>
    t.creatorId === currentUser.id || t.members.some(m => m.userId === currentUser.id)
  );

  const handleQuickConnect = (targetUserId: string) => {
    storage.sendConnectionRequest(currentUser.id, targetUserId);
    refreshState();
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CampusConnect AI Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Good day, {currentUser.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {currentUser.education.branch} ({currentUser.education.year}rd Year) • {currentUser.education.college}
            </p>
          </div>

          {/* Profile Completeness Ring Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={150}
                  strokeDashoffset={150 - (150 * completeness) / 100}
                  strokeLinecap="round"
                  className="text-indigo-400 transition-all duration-1000"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-black text-white">{completeness}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Profile Completion</div>
              <p className="text-[11px] text-slate-400">
                {completeness >= 90 ? 'Profile fully optimized!' : 'Add skills or upload resume to reach 100%'}
              </p>
              <button
                onClick={() => setCurrentTab('resume-upload')}
                className="text-[11px] text-indigo-400 font-bold hover:underline mt-1 flex items-center gap-1 cursor-pointer"
              >
                <span>Upload Resume</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Recommended For You</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                AI Skill Match
              </span>
            </div>
            <button
              onClick={() => setCurrentTab('discover')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {matchCandidates.map(match => {
              const u = match.user;
              const status = storage.getConnectionStatus(currentUser.id, u.id);

              return (
                <div
                  key={u.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition-all hover:shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80'}
                      alt={u.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{u.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {match.overallScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {u.education.branch} • {u.city}
                      </p>
                      <p className="text-[11px] text-indigo-300 font-medium mt-1 truncate max-w-sm">
                        ✨ {match.detailedReasons[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onViewMatchDetails(u, match)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 cursor-pointer transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Why</span>
                    </button>

                    {status === 'ACCEPTED' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                        Connected
                      </span>
                    ) : status === 'PENDING_SENT' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                        Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQuickConnect(u.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Assembling a Hackathon Team?</h4>
                <p className="text-[11px] text-slate-400">
                  Enter your project requirements and let AI discover an optimal 4-person multi-disciplinary roster.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('team-builder')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Find Team
            </button>
          </div>
        </div>

        {/* Right Column: Your Profile Highlights & Active Teams */}
        <div className="space-y-6">
          {/* Your Skills Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Technical Skills</h3>
              </div>
              <button
                onClick={() => setCurrentTab('profile')}
                className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentUser.skills.map(s => (
                <span
                  key={s.name}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                >
                  {s.name} <span className="text-[10px] text-indigo-400 font-normal">({s.level})</span>
                </span>
              ))}
            </div>

            {currentUser.lookingForSkills && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1.5">Looking for collaborators with:</span>
                <div className="flex flex-wrap gap-1">
                  {currentUser.lookingForSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Teams Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Active Teams</h3>
              </div>
              <button
                onClick={() => setCurrentTab('team-builder')}
                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
              >
                + New Team
              </button>
            </div>

            {myTeams.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No active teams yet.</p>
            ) : (
              <div className="space-y-2">
                {myTeams.map(t => (
                  <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">{t.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>Members: {t.members.length}/{t.targetSize}</span>
                      <button
                        onClick={() => setCurrentTab('chat')}
                        className="text-indigo-400 font-bold hover:underline cursor-pointer"
                      >
                        Team Chat →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Next Actions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 mb-2">Recommended Actions:</h4>

            <div
              onClick={() => setCurrentTab('resume-upload')}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between text-xs cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Upload & Parse Resume</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div
              onClick={() => setCurrentTab('skill-gap')}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between text-xs cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span className="text-slate-200">Run Skill Gap Analysis</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div
              onClick={() => setCurrentTab('projects')}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between text-xs cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200">Post a Portfolio Project</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

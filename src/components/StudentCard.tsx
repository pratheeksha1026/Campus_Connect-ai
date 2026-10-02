import React from 'react';
import {
  MapPin,
  GraduationCap,
  Sparkles,
  UserPlus,
  Check,
  Clock,
  ExternalLink,
  Shield,
  Layers,
  Heart
} from 'lucide-react';
import { User, MatchResult, ConnectionStatus } from '../types';

interface StudentCardProps {
  matchResult: MatchResult;
  connectionStatus: ConnectionStatus;
  onConnect: (targetUserId: string) => void;
  onViewDetails: (targetUser: User, matchResult: MatchResult) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  matchResult,
  connectionStatus,
  onConnect,
  onViewDetails,
}) => {
  const { user, overallScore, commonSkills, commonInterests, detailedReasons, complementarySkills } = matchResult;

  // Badge color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-teal-400 text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 80) return 'from-indigo-500 to-blue-400 text-indigo-300 border-indigo-500/30 bg-indigo-500/10';
    if (score >= 70) return 'from-amber-500 to-orange-400 text-amber-300 border-amber-500/30 bg-amber-500/10';
    return 'from-slate-500 to-gray-400 text-slate-300 border-slate-500/30 bg-slate-500/10';
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden group">
      {/* Header Info Banner */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&fit=crop&q=80'}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-indigo-400/70 transition-colors shadow-md"
              />
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online now" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base group-hover:text-indigo-200 transition-colors">
                  {user.name}
                </h3>
                {user.role === 'admin' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate max-w-[170px]">{user.education.branch}</span>
                <span>•</span>
                <span className="font-semibold text-slate-300">{user.education.year}rd Year</span>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{user.city}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{user.education.college}</span>
              </div>
            </div>
          </div>

          {/* AI Match Score Pill */}
          <div className={`px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-center shrink-0 ${getScoreColor(overallScore)}`}>
            <div className="flex items-center gap-1 font-black text-sm tracking-tight">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{overallScore}%</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">Match</span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Top Skills */}
        <div className="mt-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" /> Top Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.slice(0, 4).map(skill => {
              const isCommon = commonSkills.some(cs => cs.toLowerCase() === skill.name.toLowerCase());
              return (
                <span
                  key={skill.name}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                    isCommon
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 font-semibold'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {skill.name}
                  {isCommon && <span className="text-[9px] ml-1 text-indigo-400">★</span>}
                </span>
              );
            })}
            {user.skills.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                +{user.skills.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Shared Interests Preview */}
        {commonInterests.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Heart className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="truncate">
              Shared: <strong className="text-slate-200">{commonInterests.slice(0, 3).join(', ')}</strong>
            </span>
          </div>
        )}

        {/* Complementary skills preview */}
        {complementarySkills.theyProvide.length > 0 && (
          <div className="mt-1.5 text-[11px] text-emerald-400 font-medium truncate flex items-center gap-1">
            <span>✨ Brings:</span>
            <span className="text-emerald-300">{complementarySkills.theyProvide.slice(0, 2).join(', ')}</span>
          </div>
        )}
      </div>

      {/* AI Explanation Snippet Box */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800/80 text-xs">
        <p className="text-[11px] text-indigo-300 flex items-center gap-1 font-medium truncate">
          <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>{detailedReasons[0] || 'High skill and contextual compatibility.'}</span>
        </p>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 pt-3 border-t border-slate-800 flex items-center gap-2 bg-slate-900/40">
        <button
          onClick={() => onViewDetails(user, matchResult)}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          <span>Why You Match</span>
        </button>

        {connectionStatus === 'ACCEPTED' ? (
          <div className="py-2 px-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Connected</span>
          </div>
        ) : connectionStatus === 'PENDING_SENT' ? (
          <div className="py-2 px-3.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
        ) : connectionStatus === 'PENDING_RECEIVED' ? (
          <button
            onClick={() => onConnect(user.id)}
            className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept</span>
          </button>
        ) : (
          <button
            onClick={() => onConnect(user.id)}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </div>
  );
};

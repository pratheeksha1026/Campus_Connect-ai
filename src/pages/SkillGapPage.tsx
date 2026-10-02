import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { areSkillsRelated } from '../services/aiMatching';
import { User } from '../types';

interface TargetRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
}

const CAREER_PATHS: TargetRole[] = [
  {
    id: 'ml_engineer',
    title: 'Machine Learning Engineer',
    description: 'Design, train, and deploy predictive models, neural networks, and generative AI pipelines into production.',
    requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'Scikit-learn', 'SQL', 'FastAPI', 'Docker', 'Pandas', 'Deep Learning'],
  },
  {
    id: 'fullstack_dev',
    title: 'Full Stack Web Architect',
    description: 'Build robust, responsive web applications from database architecture to smooth frontend user interfaces.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Next.js', 'Docker', 'REST APIs'],
  },
  {
    id: 'cloud_devops',
    title: 'Cloud & DevOps Engineer',
    description: 'Manage automated CI/CD pipelines, container orchestration, and multi-cloud infrastructure reliability.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'Terraform', 'Python', 'Go'],
  },
  {
    id: 'ui_ux_designer',
    title: 'Product & UI/UX Designer',
    description: 'Craft intuitive interfaces, design tokens, wireframes, and conducted user experience research.',
    requiredSkills: ['UI/UX', 'Figma', 'Product Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    description: 'Defend systems against vulnerabilities, analyze threat vectors, and audit network cryptography.',
    requiredSkills: ['Cybersecurity', 'Linux', 'Network Security', 'Python', 'Cryptography', 'Penetration Testing', 'Docker'],
  },
];

interface SkillGapPageProps {
  onOpenChat: (userId: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ onOpenChat }) => {
  const { currentUser, allUsers, refreshState } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('ml_engineer');

  const selectedRole = CAREER_PATHS.find(r => r.id === selectedRoleId) || CAREER_PATHS[0];
  const mySkillNames = currentUser.skills.map(s => s.name);

  // Divide into acquired vs missing skills
  const acquiredSkills = selectedRole.requiredSkills.filter(req =>
    mySkillNames.some(ms => areSkillsRelated(ms, req))
  );

  const missingSkills = selectedRole.requiredSkills.filter(req =>
    !acquiredSkills.includes(req)
  );

  const readinessPercent = Math.round(
    (acquiredSkills.length / Math.max(1, selectedRole.requiredSkills.length)) * 100
  );

  // Recommend peers who possess the missing skills
  const peerMentors = allUsers.filter(u => {
    if (u.id === currentUser.id || u.isSuspended) return false;
    const uSkills = u.skills.map(s => s.name);
    // User must have at least 1 missing skill
    return missingSkills.some(ms => uSkills.some(us => areSkillsRelated(us, ms)));
  }).map(u => {
    const uSkills = u.skills.map(s => s.name);
    const helpsWith = missingSkills.filter(ms => uSkills.some(us => areSkillsRelated(us, ms)));
    return {
      user: u,
      helpsWith,
    };
  }).sort((a, b) => b.helpsWith.length - a.helpsWith.length).slice(0, 4);

  const handleConnectPeer = (targetUserId: string) => {
    storage.sendConnectionRequest(currentUser.id, targetUserId);
    refreshState();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Peer Learning & Career Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          AI Skill Gap Analysis & Peer Mentor Discovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Select your target engineering career goal. CampusConnect compares your existing skill matrix against industry standards, identifies missing competencies, and connects you directly with students in your network who can mentor you.
        </p>
      </div>

      {/* Career Path Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CAREER_PATHS.map(role => {
          const isSelected = selectedRoleId === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Target className={`w-5 h-5 mb-2 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
              <div>
                <span className="text-xs font-bold block">{role.title}</span>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {role.requiredSkills.length} competencies
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Target Analysis Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <span>Target Role: {selectedRole.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {selectedRole.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-black bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
              {readinessPercent}%
            </span>
            <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
              Role Readiness
            </div>
          </div>
        </div>

        {/* Acquired vs Missing Skills Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Acquired */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Skills You Already Possess ({acquiredSkills.length})
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold">Matched</span>
            </div>

            {acquiredSkills.length === 0 ? (
              <p className="text-xs text-slate-500">None yet for this specialized path.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {acquiredSkills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Missing Competencies to Target ({missingSkills.length})
              </h3>
              <span className="text-[10px] text-amber-400 font-semibold">Action Items</span>
            </div>

            {missingSkills.length === 0 ? (
              <p className="text-xs text-emerald-400 font-semibold">
                Congratulations! You possess all core competencies for this role.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Peer Mentorship Recommendations */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Recommended Peer Mentors Who Know These Skills</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect with students who have mastered the technologies you are currently missing.
              </p>
            </div>
            <span className="text-xs text-slate-400">{peerMentors.length} Peers Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {peerMentors.map(({ user, helpsWith }) => {
              const status = storage.getConnectionStatus(currentUser.id, user.id);

              return (
                <div
                  key={user.id}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-sky-500/40 rounded-2xl flex items-center justify-between gap-4 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                      alt={user.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs">{user.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {user.education.college} • {user.city}
                      </p>
                      <div className="text-[11px] text-sky-400 font-medium mt-1">
                        Can teach: <strong className="text-sky-300">{helpsWith.join(', ')}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    {status === 'ACCEPTED' ? (
                      <button
                        onClick={() => onOpenChat(user.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        Ask Advice
                      </button>
                    ) : status === 'PENDING_SENT' ? (
                      <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnectPeer(user.id)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-sky-600/30 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

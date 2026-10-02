import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Shield,
  Layers,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { recommendTeam } from '../services/teamBuilder';
import { TeamMatchRecommendation, Team } from '../types';

interface TeamBuilderPageProps {
  onOpenTeamChat: (teamId: string) => void;
}

export const TeamBuilderPage: React.FC<TeamBuilderPageProps> = ({ onOpenTeamChat }) => {
  const { currentUser, allUsers, refreshState } = useAuth();

  // Form state
  const [projectName, setProjectName] = useState('AI Healthcare Diagnostic Platform');
  const [projectDesc, setProjectDesc] = useState(
    'Real-time automated chest X-ray disease detection system with heatmaps, clinical voice summaries, and patient record integration.'
  );
  const [projectType, setProjectType] = useState<'Hackathon' | 'Capstone Project' | 'Startup Idea'>('Hackathon');
  const [targetSize, setTargetSize] = useState<number>(4);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'Python',
    'Machine Learning',
    'React',
    'Backend Development',
    'UI/UX',
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Recommendation state
  const [recommendation, setRecommendation] = useState<TeamMatchRecommendation | null>(() => {
    return recommendTeam(
      currentUser,
      allUsers,
      ['Python', 'Machine Learning', 'React', 'Backend Development', 'UI/UX'],
      4
    );
  });
  const [isSearching, setIsSearching] = useState(false);
  const [teamCreatedSuccess, setTeamCreatedSuccess] = useState<string | null>(null);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);

  const myTeams = storage.getTeams().filter(
    t => t.creatorId === currentUser.id || t.members.some(m => m.userId === currentUser.id)
  );

  const handleAddSkill = () => {
    if (!customSkillInput.trim()) return;
    if (!requiredSkills.includes(customSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, customSkillInput.trim()]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleRunTeamMatch = () => {
    setIsSearching(true);
    setTeamCreatedSuccess(null);
    setTimeout(() => {
      const rec = recommendTeam(currentUser, allUsers, requiredSkills, targetSize);
      setRecommendation(rec);
      setIsSearching(false);
    }, 700);
  };

  const handleCreateAndInvite = () => {
    if (!recommendation) return;

    // Create team members list starting with currentUser
    const initialMembers = [
      {
        userId: currentUser.id,
        user: currentUser,
        role: 'Team Lead / ML Engineer',
        assignedSkills: currentUser.skills.map(s => s.name).slice(0, 3),
        joinedAt: new Date().toISOString(),
      },
      ...recommendation.recommendedMembers.map(m => ({
        userId: m.user.id,
        user: m.user,
        role: m.suggestedRole,
        assignedSkills: m.coveredSkills,
        joinedAt: new Date().toISOString(),
      })),
    ];

    const newTeam = storage.createTeam({
      name: projectName,
      description: projectDesc,
      creatorId: currentUser.id,
      requiredSkills,
      targetSize,
      type: projectType,
      status: initialMembers.length >= targetSize ? 'Full' : 'Recruiting',
      compatibilityScore: recommendation.teamCompatibilityScore,
      members: initialMembers,
    });

    // Post inaugural group chat message
    storage.sendMessage(
      currentUser.id,
      undefined,
      `👋 Welcome to the "${newTeam.name}" group chat! Let's introduce our roles, plan milestones, and kick off our project!`,
      newTeam.id
    );

    refreshState();
    setCreatedTeamId(newTeam.id);
    setTeamCreatedSuccess(`Team "${newTeam.name}" successfully created with ${initialMembers.length} members!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flagship Feature • Team Matching Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Find My Team — Hackathon & Project Formation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Define your project requirements and target team size. Our AI searches through available engineering peers to construct a balanced, complementary team roster with assigned responsibilities.
        </p>
      </div>

      {/* Grid: Requirement Builder Form & AI Recommendation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Requirements Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Project Requirements
            </h2>
            <span className="text-[10px] text-slate-400">Step 1 of 2</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Project / Hackathon Title
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Description
            </label>
            <textarea
              value={projectDesc}
              onChange={e => setProjectDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Team Size
              </label>
              <select
                value={targetSize}
                onChange={e => setTargetSize(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value={2}>2 Members</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members (Standard Hackathon)</option>
                <option value={5}>5 Members</option>
                <option value={6}>6 Members</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Category
              </label>
              <select
                value={projectType}
                onChange={e => setProjectType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Capstone Project">Capstone Project</option>
                <option value="Startup Idea">Startup Idea</option>
              </select>
            </div>
          </div>

          {/* Required Skills Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Required Team Competencies ({requiredSkills.length})
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-emerald-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick add */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={e => setCustomSkillInput(e.target.value)}
                placeholder="Add skill (e.g. Docker, Flutter)..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleRunTeamMatch}
            disabled={isSearching}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching Peer Network...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Team Matching Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Recommended Team */}
        <div className="lg:col-span-7 space-y-6">
          {teamCreatedSuccess && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold">{teamCreatedSuccess}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {createdTeamId && (
                  <button
                    onClick={() => onOpenTeamChat(createdTeamId)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Team Group Chat Now</span>
                  </button>
                )}
                <button
                  onClick={() => setTeamCreatedSuccess(null)}
                  className="text-emerald-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {recommendation && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Compatibility Header Banner */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> AI Team Synergy Assessment
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Optimal Roster Configuration
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    {recommendation.teamSynergySummary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-4xl font-black bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                    {recommendation.teamCompatibilityScore}%
                  </span>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Compatibility
                  </div>
                </div>
              </div>

              {/* Proposed Team Members Roster */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Proposed Multi-Disciplinary Roster
                </h4>

                {/* Current User (Lead) */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-indigo-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                          You (Lead)
                        </span>
                      </div>
                      <div className="text-[11px] text-indigo-300 font-medium">
                        Role: AI / ML Lead
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Provides: {currentUser.skills.slice(0, 2).map(s => s.name).join(', ')}
                  </span>
                </div>

                {/* Recommended Candidates */}
                {recommendation.recommendedMembers.map((member, i) => (
                  <div
                    key={member.user.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                        alt={member.user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{member.user.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                            {member.matchScore}% Match
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                          Suggested Role: {member.suggestedRole}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {member.user.education.college} • {member.user.city}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block mb-1">Covers:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {member.coveredSkills.map(s => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills Coverage Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-bold">Required Competency Coverage</span>
                  <span className="font-bold text-emerald-400">
                    {recommendation.allCoveredSkills.length} / {requiredSkills.length} Covered
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {requiredSkills.map(req => {
                    const isCovered = recommendation.allCoveredSkills.includes(req);
                    return (
                      <span
                        key={req}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                          isCovered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isCovered ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                        )}
                        <span>{req}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  Ready to collaborate? Creates the team workspace and dispatches invites.
                </span>

                <button
                  onClick={handleCreateAndInvite}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Create Team & Invite All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Created Teams Section */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>Your Active Collaboration Teams ({myTeams.length})</span>
        </h2>

        {myTeams.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No teams formed yet. Use the tool above to start one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTeams.map(t => (
              <div key={t.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{t.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {t.type}
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{t.compatibilityScore || 92}% Synergy</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    {t.members.map((m, idx) => (
                      <img
                        key={idx}
                        src={m.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                        alt={m.user?.name || 'Member'}
                        title={`${m.user?.name} (${m.role})`}
                        className="w-7 h-7 rounded-full object-cover border-2 border-slate-900"
                      />
                    ))}
                    <span className="text-[10px] text-slate-400 pl-3">
                      {t.members.length} / {t.targetSize} Members
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenTeamChat(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Team Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

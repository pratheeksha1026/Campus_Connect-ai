import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Edit3,
  Check,
  Plus,
  X,
  FileText,
  Shield,
  Layers,
  Heart,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserSkill } from '../types';

interface ProfilePageProps {
  onGoToResume: () => void;
}

const INTERESTS_OPTIONS = [
  'AI', 'Machine Learning', 'Web Development', 'App Development',
  'Cybersecurity', 'Cloud', 'Data Science', 'Movies', 'Music',
  'Gaming', 'Sports', 'Travel', 'Photography', 'Reading', 'Robotics', 'Design'
];

const GOALS_OPTIONS = [
  'Make friends', 'Find study partners', 'Find hackathon teammates',
  'Find project partners', 'Networking', 'Learn new skills', 'Find mentors'
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onGoToResume }) => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Form edit states
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [city, setCity] = useState(currentUser.city);
  const [college, setCollege] = useState(currentUser.education.college);
  const [degree, setDegree] = useState(currentUser.education.degree);
  const [branch, setBranch] = useState(currentUser.education.branch);
  const [year, setYear] = useState(currentUser.education.year);
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser.interests || []);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(currentUser.connectionGoals || []);

  const [skillsList, setSkillsList] = useState<UserSkill[]>(currentUser.skills || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  const handleSave = () => {
    updateProfile({
      name,
      bio,
      city,
      education: {
        ...currentUser.education,
        college,
        degree,
        branch,
        year,
      },
      linkedinUrl: linkedinUrl || undefined,
      githubUrl: githubUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
      interests: selectedInterests,
      connectionGoals: selectedGoals,
      skills: skillsList,
    });
    setIsEditing(false);
  };

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleToggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsList([
      ...skillsList,
      { name: newSkillName.trim(), level: newSkillLevel, yearsOfExp: 1 },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkillsList(skillsList.filter(s => s.name !== skillName));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  {currentUser.education.year}rd Year
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>{currentUser.education.degree} in {currentUser.education.branch}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{currentUser.city} • {currentUser.education.college}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToResume}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Resume AI</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <p className="text-xs text-slate-300 mt-5 pt-4 border-t border-slate-800/80 leading-relaxed">
            {currentUser.bio}
          </p>
        )}
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <span>Edit Student Profile</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Short Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">College / Institution</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="pt-3 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Skills & Proficiency
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {skillsList.map(s => (
                <span
                  key={s.name}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{s.name} ({s.level})</span>
                  <button type="button" onClick={() => handleRemoveSkill(s.name)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Skill name (e.g. Next.js)..."
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              <select
                value={newSkillLevel}
                onChange={e => setNewSkillLevel(e.target.value as any)}
                className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 text-xs font-bold rounded-xl text-white hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Interests & Goals Selectors */}
          <div className="pt-3 border-t border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Interests & Hobbies
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS_OPTIONS.map(i => {
                  const sel = selectedInterests.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleInterest(i)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        sel
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Connection Goals
              </label>
              <div className="flex flex-wrap gap-1.5">
                {GOALS_OPTIONS.map(g => {
                  const sel = selectedGoals.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleToggleGoal(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        sel
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      ) : (
        /* Profile Display Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Skills & Professional Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Technical Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Technical Skills ({currentUser.skills.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentUser.skills.map(skill => (
                  <div key={skill.name} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-white">{skill.name}</span>
                      <span className="text-[11px] text-indigo-400 font-semibold">{skill.level}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: skill.level === 'Expert' ? '95%' : skill.level === 'Advanced' ? '78%' : '55%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience & Certifications */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Certifications & Experience
              </h3>
              <div className="space-y-2 text-xs">
                {currentUser.experience?.map((exp, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                    💼 {exp}
                  </div>
                ))}
                {currentUser.certifications?.map((cert, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                    🎖️ {cert}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interests, Goals, Socials */}
          <div className="space-y-6">
            {/* Interests & Goals */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart className="w-4 h-4" /> Interests & Hobbies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.interests.map(i => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[11px] border border-slate-800">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Connection Goals
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.connectionGoals.map(g => (
                    <span key={g} className="px-2.5 py-0.5 rounded-md bg-slate-950 text-emerald-300 text-[11px] border border-emerald-500/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Profiles */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Social Profiles
                </h4>
                {currentUser.linkedinUrl && (
                  <a
                    href={currentUser.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 flex items-center justify-between text-xs text-sky-400 transition"
                  >
                    <span className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</span>
                    <span>View →</span>
                  </a>
                )}
                {currentUser.githubUrl && (
                  <a
                    href={currentUser.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 flex items-center justify-between text-xs text-slate-200 transition"
                  >
                    <span className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</span>
                    <span>View →</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

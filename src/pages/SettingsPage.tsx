import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Lock,
  Eye,
  Sparkles,
  MapPin,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { DEFAULT_WEIGHTS } from '../services/aiMatching';
import { MatchingWeights, PrivacySettings } from '../types';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateProfile, resetAllDemoData, refreshState } = useAuth();

  const [privacy, setPrivacy] = useState<PrivacySettings>(currentUser.privacy || {
    profileVisibility: 'public',
    showLocation: true,
    showResume: true,
    showSocialLinks: true,
    allowRequestsFrom: 'everyone',
  });

  const [weights, setWeights] = useState<MatchingWeights>(storage.getWeights());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const totalWeightPercent = Math.round(
    (weights.skills +
     weights.interests +
     weights.projectGoals +
     weights.location +
     weights.educationBranch +
     weights.hackathon +
     weights.careerGoals +
     weights.year) * 100
  );

  const handleSavePrivacy = () => {
    updateProfile({ privacy });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveWeights = () => {
    storage.setWeights(weights);
    refreshState();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    storage.setWeights(DEFAULT_WEIGHTS);
    refreshState();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Privacy Settings & Algorithm Tuning</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your student privacy preferences, visibility controls, and tune the AI matching engine weights.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Settings successfully saved and synchronized!</span>
        </div>
      )}

      {/* Privacy Controls Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Student Privacy & Safety Guardrails</span>
        </h2>

        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white">Profile Visibility Scope</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Control who can discover and view your academic profile.</p>
            </div>
            <select
              value={privacy.profileVisibility}
              onChange={e => setPrivacy({ ...privacy, profileVisibility: e.target.value as any })}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            >
              <option value="public">Public (All verified campuses)</option>
              <option value="college_only">Same College Only</option>
              <option value="connections_only">Accepted Connections Only</option>
            </select>
          </div>

          {/* Location Privacy */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Approximate Proximity
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Show approximate city & locality for local study sessions (Never reveals exact GPS/address).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showLocation}
                onChange={e => setPrivacy({ ...privacy, showLocation: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Resume Visibility */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Resume & Experience Highlights
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Allow connected peers to view your extracted project highlights and certifications.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showResume}
                onChange={e => setPrivacy({ ...privacy, showResume: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Social Profiles */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white">External Profiles (LinkedIn & GitHub)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Display verified outbound links on your match card.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showSocialLinks}
                onChange={e => setPrivacy({ ...privacy, showSocialLinks: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSavePrivacy}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Save Privacy Settings
          </button>
        </div>
      </div>

      {/* Configurable AI Algorithm Weights Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Transparent AI Matching Weights Customizer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tune how the 8 compatibility factors influence your personalized recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              totalWeightPercent === 100
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              Total Weight: {totalWeightPercent}%
            </span>
            <button
              onClick={handleResetWeights}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {[
            { key: 'skills', label: 'Technical Skills (Default 25%)', val: weights.skills },
            { key: 'interests', label: 'Hobbies & Interests (Default 15%)', val: weights.interests },
            { key: 'projectGoals', label: 'Project Goals (Default 15%)', val: weights.projectGoals },
            { key: 'location', label: 'Location Proximity (Default 10%)', val: weights.location },
            { key: 'educationBranch', label: 'Education / Branch (Default 10%)', val: weights.educationBranch },
            { key: 'hackathon', label: 'Hackathon Intent (Default 10%)', val: weights.hackathon },
            { key: 'careerGoals', label: 'Career Alignment (Default 10%)', val: weights.careerGoals },
            { key: 'year', label: 'Academic Year Match (Default 5%)', val: weights.year },
          ].map(item => (
            <div key={item.key} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-medium text-slate-200">
                <span>{item.label}</span>
                <span className="font-bold text-indigo-400">{Math.round(item.val * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={item.val}
                onChange={e => setWeights({ ...weights, [item.key]: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveWeights}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Apply Algorithm Weights
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Database */}
      <div className="bg-slate-900 border border-rose-500/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Demo Environment Controls</h3>
          <p className="text-xs text-slate-400 mt-1">
            Restore all pre-seeded college students, sample projects, teams, and connections back to factory demo state.
          </p>
        </div>

        <button
          onClick={resetAllDemoData}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>
    </div>
  );
};

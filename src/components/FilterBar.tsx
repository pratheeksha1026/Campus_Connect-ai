import React from 'react';
import { Search, Filter, X, SlidersHorizontal, MapPin, Sparkles } from 'lucide-react';
import { MatchingMode } from '../types';

export interface FilterState {
  searchQuery: string;
  selectedCity: string;
  selectedCollege: string;
  selectedBranch: string;
  selectedYear: string;
  selectedDistance: string;
  hackathonOnly: boolean;
  minScore: number;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  matchingMode: MatchingMode;
  setMatchingMode: (mode: MatchingMode) => void;
  availableCities: string[];
  availableColleges: string[];
  availableBranches: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  matchingMode,
  setMatchingMode,
  availableCities,
  availableColleges,
  availableBranches,
}) => {
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedCity !== 'ALL' ||
    filters.selectedCollege !== 'ALL' ||
    filters.selectedBranch !== 'ALL' ||
    filters.selectedYear !== 'ALL' ||
    filters.selectedDistance !== 'ALL' ||
    filters.hackathonOnly ||
    filters.minScore > 50;

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCity: 'ALL',
      selectedCollege: 'ALL',
      selectedBranch: 'ALL',
      selectedYear: 'ALL',
      selectedDistance: 'ALL',
      hackathonOnly: false,
      minScore: 50,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
      {/* Top Bar: 3 Matching Modes Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Matching Strategy
          </span>
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setMatchingMode('FRIEND_MATCH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                matchingMode === 'FRIEND_MATCH'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎉 Friend Match
            </button>
            <button
              onClick={() => setMatchingMode('SKILL_MATCH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                matchingMode === 'SKILL_MATCH'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Skill Match
            </button>
            <button
              onClick={() => setMatchingMode('TEAM_MATCH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                matchingMode === 'TEAM_MATCH'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Team Match
            </button>
          </div>
        </div>

        {/* Mode Explanation */}
        <div className="text-xs text-slate-400 max-w-sm">
          {matchingMode === 'FRIEND_MATCH' && (
            <span>Optimized for shared hobbies, gaming, music, movies, and campus proximity.</span>
          )}
          {matchingMode === 'SKILL_MATCH' && (
            <span>Prioritizes complementary engineering skills, GitHub projects, and peer learning.</span>
          )}
          {matchingMode === 'TEAM_MATCH' && (
            <span>Focused on hackathons, project teammates, and multi-disciplinary roles.</span>
          )}
        </div>
      </div>

      {/* Search Input & Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Field */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by skill (e.g. Python, React), interest, or name..."
            value={filters.searchQuery}
            onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.selectedCity}
            onChange={e => setFilters(prev => ({ ...prev, selectedCity: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Cities</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.selectedDistance}
            onChange={e => setFilters(prev => ({ ...prev, selectedDistance: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Any Distance</option>
            <option value="SAME_CITY">Same City Only</option>
            <option value="15">Within 15 km</option>
            <option value="30">Within 30 km</option>
          </select>
        </div>
      </div>

      {/* Secondary Dropdowns & Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1 text-xs">
        {/* College */}
        <div className="col-span-2">
          <select
            value={filters.selectedCollege}
            onChange={e => setFilters(prev => ({ ...prev, selectedCollege: e.target.value }))}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none text-xs"
          >
            <option value="ALL">All Colleges</option>
            {availableColleges.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <div className="col-span-2">
          <select
            value={filters.selectedBranch}
            onChange={e => setFilters(prev => ({ ...prev, selectedBranch: e.target.value }))}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none text-xs"
          >
            <option value="ALL">All Branches</option>
            {availableBranches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <select
            value={filters.selectedYear}
            onChange={e => setFilters(prev => ({ ...prev, selectedYear: e.target.value }))}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none text-xs"
          >
            <option value="ALL">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {/* Hackathon Only Toggle */}
        <div className="flex items-center">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filters.hackathonOnly}
              onChange={e => setFilters(prev => ({ ...prev, hackathonOnly: e.target.checked }))}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-[11px] whitespace-nowrap">🚀 Hackathons</span>
          </label>
        </div>
      </div>

      {/* Reset button if active */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/60">
          <span className="text-slate-400">Filters active</span>
          <button
            onClick={resetFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

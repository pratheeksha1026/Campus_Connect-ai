import React, { useState, useMemo } from 'react';
import { Sparkles, Users, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { calculateMatchScore, calculateDistanceKm } from '../services/aiMatching';
import { StudentCard } from '../components/StudentCard';
import { FilterBar, FilterState } from '../components/FilterBar';
import { MatchResult, User, MatchingMode } from '../types';

interface DiscoverPageProps {
  onViewMatchDetails: (user: User, matchResult: MatchResult) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onViewMatchDetails }) => {
  const { currentUser, allUsers, refreshState } = useAuth();
  const [matchingMode, setMatchingMode] = useState<MatchingMode>('SKILL_MATCH');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCity: 'ALL',
    selectedCollege: 'ALL',
    selectedBranch: 'ALL',
    selectedYear: 'ALL',
    selectedDistance: 'ALL',
    hackathonOnly: false,
    minScore: 50,
  });

  // Extract unique filters from user pool
  const availableCities = useMemo(() => {
    return Array.from(new Set(allUsers.map(u => u.city))).filter(Boolean);
  }, [allUsers]);

  const availableColleges = useMemo(() => {
    return Array.from(new Set(allUsers.map(u => u.education.college))).filter(Boolean);
  }, [allUsers]);

  const availableBranches = useMemo(() => {
    return Array.from(new Set(allUsers.map(u => u.education.branch))).filter(Boolean);
  }, [allUsers]);

  // Compute matches and apply filters
  const processedMatches: MatchResult[] = useMemo(() => {
    return allUsers
      .filter(u => u.id !== currentUser.id && !u.isSuspended)
      .map(candidate => {
        return calculateMatchScore(currentUser, candidate, matchingMode, storage.getWeights());
      })
      .filter(match => {
        const u = match.user;

        // Search query filter (name, skills, interests, college)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = u.name.toLowerCase().includes(q);
          const matchesSkill = u.skills.some(s => s.name.toLowerCase().includes(q));
          const matchesInterest = u.interests.some(i => i.toLowerCase().includes(q));
          const matchesCollege = u.education.college.toLowerCase().includes(q);
          if (!matchesName && !matchesSkill && !matchesInterest && !matchesCollege) {
            return false;
          }
        }

        // City
        if (filters.selectedCity !== 'ALL' && u.city !== filters.selectedCity) {
          return false;
        }

        // College
        if (filters.selectedCollege !== 'ALL' && u.education.college !== filters.selectedCollege) {
          return false;
        }

        // Branch
        if (filters.selectedBranch !== 'ALL' && u.education.branch !== filters.selectedBranch) {
          return false;
        }

        // Year
        if (filters.selectedYear !== 'ALL' && u.education.year.toString() !== filters.selectedYear) {
          return false;
        }

        // Hackathon Only
        if (filters.hackathonOnly) {
          const hasHackathon =
            u.connectionGoals.some(g => g.toLowerCase().includes('hackathon')) ||
            u.interests.some(i => i.toLowerCase().includes('hackathon'));
          if (!hasHackathon) return false;
        }

        // Distance filter
        if (filters.selectedDistance === 'SAME_CITY') {
          if (u.city.toLowerCase() !== currentUser.city.toLowerCase()) return false;
        } else if (filters.selectedDistance !== 'ALL') {
          const maxDist = parseInt(filters.selectedDistance, 10);
          if (currentUser.approxLocation && u.approxLocation) {
            const dist = calculateDistanceKm(
              currentUser.approxLocation.lat, currentUser.approxLocation.lng,
              u.approxLocation.lat, u.approxLocation.lng
            );
            if (dist !== null && dist > maxDist) return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.overallScore - a.overallScore);
  }, [allUsers, currentUser, matchingMode, filters]);

  const handleConnect = (targetUserId: string) => {
    const curStatus = storage.getConnectionStatus(currentUser.id, targetUserId);
    if (curStatus === 'PENDING_RECEIVED') {
      storage.acceptConnection(targetUserId, currentUser.id);
    } else if (curStatus === 'NONE') {
      storage.sendConnectionRequest(currentUser.id, targetUserId);
    }
    refreshState();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Student Discovery</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {processedMatches.length} Matches Found
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI-powered peer matching using weighted factor analysis & semantic similarity across all institutions.
          </p>
        </div>

        {/* Multi-College vs Same-College Quick Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedCollege: 'ALL' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                filters.selectedCollege === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌍 All Colleges
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedCollege: currentUser.education.college }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                filters.selectedCollege === currentUser.education.college
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏫 My Campus Only
            </button>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        matchingMode={matchingMode}
        setMatchingMode={setMatchingMode}
        availableCities={availableCities}
        availableColleges={availableColleges}
        availableBranches={availableBranches}
      />

      {/* Student Cards Grid */}
      {processedMatches.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No students match your active filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try broadening your search criteria or resetting filters to discover more students across other branches and colleges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedMatches.map(match => {
            const status = storage.getConnectionStatus(currentUser.id, match.userId);
            return (
              <StudentCard
                key={match.userId}
                matchResult={match}
                connectionStatus={status}
                onConnect={handleConnect}
                onViewDetails={onViewMatchDetails}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

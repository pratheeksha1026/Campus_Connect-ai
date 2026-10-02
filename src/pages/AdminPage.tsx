import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  UserCheck,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Ban,
  RotateCcw,
  BarChart3,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';

export const AdminPage: React.FC = () => {
  const { allUsers, refreshState } = useAuth();
  const [reports, setReports] = useState(storage.getReports());
  const [userList, setUserList] = useState(storage.getAllUsers());

  // Statistics
  const totalUsers = userList.length;
  const activeUsers = userList.filter(u => u.isOnline).length;
  const totalConnections = storage.getConnections('all_placeholder').length || 6;
  const totalTeams = storage.getTeams().length;
  const totalProjects = storage.getProjects().length;
  const pendingReports = reports.filter(r => r.status === 'PENDING').length;

  // Compute skill frequencies
  const skillCount: Record<string, number> = {};
  userList.forEach(u => {
    u.skills.forEach(s => {
      skillCount[s.name] = (skillCount[s.name] || 0) + 1;
    });
  });
  const popularSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Compute city distribution
  const cityCount: Record<string, number> = {};
  userList.forEach(u => {
    cityCount[u.city] = (cityCount[u.city] || 0) + 1;
  });

  const handleToggleSuspend = (userId: string) => {
    const u = storage.getUserById(userId);
    if (u) {
      storage.updateUser(userId, { isSuspended: !u.isSuspended });
      setUserList(storage.getAllUsers());
      refreshState();
    }
  };

  const handleResolveReport = (reportId: string, action: 'DISMISSED' | 'SUSPEND') => {
    storage.resolveReport(reportId, action);
    setReports(storage.getReports());
    setUserList(storage.getAllUsers());
    refreshState();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Community Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Administrative Operations & Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            System health metrics, student user management, report reviews, and cross-campus distribution analysis.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalUsers}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Online</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-2xl font-black text-emerald-400">{activeUsers}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Connections</span>
            <UserCheck className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalConnections}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Teams Formed</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalTeams}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Projects</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalProjects}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Open Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-400">{pendingReports}</span>
        </div>
      </div>

      {/* Analytics Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Skills */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Most Popular Student Technical Skills
          </h3>
          <div className="space-y-2.5">
            {popularSkills.map(([skill, count]) => (
              <div key={skill}>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">{skill}</span>
                  <span className="text-slate-400">{count} students</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                    style={{ width: `${(count / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Distribution */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            Geographic Student Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(cityCount).map(([city, count]) => (
              <div key={city} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-white">{city}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  {count} students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Moderation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Student User Moderation Table ({userList.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">College & Branch</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {userList.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[10px] text-slate-500">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="block font-medium">{u.education.branch}</span>
                    <span className="text-[10px] text-slate-500">{u.education.college}</span>
                  </td>
                  <td className="py-3 px-4">{u.city}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {u.skills.slice(0, 3).map(s => (
                        <span key={s.name} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px]">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {u.isSuspended ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleSuspend(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          u.isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {u.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Reports Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Reported Incidents & Audit Log ({reports.length})</span>
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-500">No reports submitted.</p>
        ) : (
          <div className="space-y-3">
            {reports.map(rep => {
              const reportedUser = storage.getUserById(rep.reportedUserId);
              return (
                <div key={rep.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-400">{rep.reason}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        Target: {reportedUser?.name || rep.reportedUserId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{rep.details}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Submitted: {new Date(rep.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {rep.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'SUSPEND')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Suspend User
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Compass,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  Bell,
  Check,
  RotateCcw,
  FileText,
  UserCheck,
  Settings,
  Info,
  Calendar,
  Share2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenArchitecture: () => void;
  onOpenTrustModal: () => void;
  onOpenAuth: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenArchitecture,
  onOpenTrustModal,
  onOpenAuth,
  onOpenShare,
}) => {
  const {
    currentUser,
    allUsers,
    switchPersona,
    unreadNotifsCount,
    unreadMessagesCount,
    notifications,
    refreshState,
    resetAllDemoData,
    logout,
  } = useAuth();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pendingRequestsCount = storage.getConnections(currentUser.id).filter(
    c => c.receiverId === currentUser.id && c.status === 'PENDING'
  ).length;

  const handleMarkNotifRead = (id: string) => {
    storage.markNotificationRead(id);
    refreshState();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  CampusConnect <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">AI</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-400 font-medium">
                  Find Your People • Build Your Team
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setCurrentTab('discover')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'discover'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Discover</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200">3 Modes</span>
              </button>

              <button
                onClick={() => setCurrentTab('team-builder')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'team-builder'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Find My Team</span>
              </button>

              <button
                onClick={() => setCurrentTab('connections')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative cursor-pointer ${
                  currentTab === 'connections'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Connections</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-slate-950 font-bold">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('chat')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative cursor-pointer ${
                  currentTab === 'chat'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
                {unreadMessagesCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-500 text-white font-bold animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('projects')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'projects'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Projects</span>
              </button>

              <button
                onClick={() => setCurrentTab('skill-gap')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'skill-gap'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>Skill Gap</span>
              </button>

              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Admin</span>
              </button>
            </nav>
          </div>

          {/* Right Controls: Persona Switcher, Architecture Modal, Notifications, Profile */}
          <div className="flex items-center gap-2.5">
            {/* Trust & Scam Prevention Button */}
            <button
              onClick={onOpenTrustModal}
              title="Student Authenticity & Scam Prevention Guide"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-xs font-semibold text-emerald-300 border border-emerald-500/40 transition cursor-pointer shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="hidden sm:inline">Trust & Safety</span>
            </button>

            {/* Share / Invite Friend Button */}
            <button
              onClick={onOpenShare}
              title="Share live link with friends & classmates"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Invite Friend</span>
            </button>

            {/* All Colleges Sign In / Register Button */}
            <button
              onClick={onOpenAuth}
              title="Sign in or register from any college worldwide"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-xs font-semibold text-indigo-200 border border-indigo-500/40 transition cursor-pointer shadow-sm"
            >
              <span>Join / Sign In</span>
            </button>

            {/* Quick Architecture Spec Button */}
            <button
              onClick={onOpenArchitecture}
              title="System Architecture & Implementation Plan"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Blueprint</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPersonaMenu(!showPersonaMenu);
                  setShowNotifMenu(false);
                  setShowProfileMenu(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium transition cursor-pointer"
                title="Switch persona to test peer interaction & chat"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-400 hidden sm:inline">Role:</span>
                <span className="font-semibold text-white max-w-[110px] truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 bg-slate-700/60 px-1 rounded">Switch</span>
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">Interactive Demo Personas</p>
                    <p className="text-[11px] text-slate-400">Switch user to test peer-matching, requests & messaging instantly.</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                    {allUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchPersona(user.id);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                          user.id === currentUser.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-medium text-white flex items-center gap-1.5">
                              {user.name}
                              {user.role === 'admin' && (
                                <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300">Admin</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {user.education?.college || 'Student'} • {user.city}
                            </div>
                          </div>
                        </div>
                        {user.id === currentUser.id && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-800 bg-slate-950/60">
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        onOpenAuth();
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition"
                    >
                      <span>+ Register from Any College</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowPersonaMenu(false);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-slate-900" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">Notifications ({notifications.length})</p>
                    <button
                      onClick={() => {
                        notifications.forEach(n => storage.markNotificationRead(n.id));
                        refreshState();
                      }}
                      className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkNotifRead(notif.id)}
                          className={`p-3 text-xs transition cursor-pointer hover:bg-slate-800/60 ${
                            !notif.read ? 'bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium text-slate-200 mb-1">
                            <span>{notif.title}</span>
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                          </div>
                          <p className="text-slate-400 text-[11px] line-clamp-2">{notif.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowPersonaMenu(false);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-400/40"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                      {currentUser.education.college}
                    </span>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('resume-upload');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Resume AI Parser</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-sky-400" />
                      <span>Privacy & Weights</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenShare();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer font-semibold text-indigo-300"
                    >
                      <Share2 className="w-4 h-4 text-indigo-400" />
                      <span>Invite Classmates</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenArchitecture();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Info className="w-4 h-4 text-amber-400" />
                      <span>Architecture Spec</span>
                    </button>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-amber-300 hover:bg-slate-800 hover:text-amber-200 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-amber-400" />
                      <span>Log Out of My Account</span>
                    </button>

                    <button
                      onClick={() => {
                        resetAllDemoData();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-rose-400 hover:bg-slate-800 hover:text-rose-300 flex items-center gap-2 cursor-pointer text-[11px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('discover')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'discover' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Discover
          </button>
          <button
            onClick={() => setCurrentTab('team-builder')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'team-builder' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Find Team
          </button>
          <button
            onClick={() => setCurrentTab('connections')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'connections' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Connections
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Chat
          </button>
          <button
            onClick={() => setCurrentTab('projects')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Projects
          </button>
          <button
            onClick={() => setCurrentTab('skill-gap')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'skill-gap' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Skill Gap
          </button>
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

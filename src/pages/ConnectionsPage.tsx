import React, { useState } from 'react';
import {
  UserCheck,
  Clock,
  Send,
  Ban,
  MessageSquare,
  Check,
  X,
  Trash2,
  ShieldAlert,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { User } from '../types';

interface ConnectionsPageProps {
  onOpenChat: (userId: string) => void;
  onReport: (userId: string) => void;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({ onOpenChat, onReport }) => {
  const { currentUser, allUsers, refreshState } = useAuth();
  const [activeTab, setActiveTab] = useState<'accepted' | 'received' | 'sent' | 'blocked'>('accepted');

  const allConnections = storage.getConnections(currentUser.id);

  // Group connections
  const acceptedConns = allConnections.filter(c => c.status === 'ACCEPTED');
  const receivedConns = allConnections.filter(c => c.receiverId === currentUser.id && c.status === 'PENDING');
  const sentConns = allConnections.filter(c => c.requesterId === currentUser.id && c.status === 'PENDING');
  const blockedConns = allConnections.filter(c => c.requesterId === currentUser.id && c.status === 'BLOCKED');

  const handleAccept = (requesterId: string) => {
    storage.acceptConnection(requesterId, currentUser.id);
    refreshState();
  };

  const handleReject = (requesterId: string) => {
    storage.rejectConnection(requesterId, currentUser.id);
    refreshState();
  };

  const handleRemove = (targetUserId: string) => {
    storage.removeConnection(currentUser.id, targetUserId);
    refreshState();
  };

  const getOtherUser = (requesterId: string, receiverId: string): User | undefined => {
    const otherId = requesterId === currentUser.id ? receiverId : requesterId;
    return allUsers.find(u => u.id === otherId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-400" />
          <span>My Student Connections</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your verified college connections, incoming collaboration requests, and peer network.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'accepted'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Connected ({acceptedConns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'received'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Requests Received ({receivedConns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({sentConns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'blocked'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Blocked ({blockedConns.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'accepted' && (
        <div className="space-y-4">
          {acceptedConns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <UserCheck className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-white">No active connections yet</p>
              <p className="text-xs text-slate-500 mt-1">Explore Discover or Team Builder to find compatible students!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedConns.map(conn => {
                const other = getOtherUser(conn.requesterId, conn.receiverId);
                if (!other) return null;

                return (
                  <div
                    key={conn.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={other.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                        alt={other.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm">{other.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-indigo-400" />
                          <span>{other.education.branch} ({other.education.year}rd Year)</span>
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{other.city}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenChat(other.id)}
                        className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
                        title="Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Message</span>
                      </button>

                      <button
                        onClick={() => handleRemove(other.id)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                        title="Remove Connection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedConns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-white">No pending requests</p>
              <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivedConns.map(conn => {
                const requester = allUsers.find(u => u.id === conn.requesterId);
                if (!requester) return null;

                return (
                  <div
                    key={conn.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={requester.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                        alt={requester.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm">{requester.name}</h3>
                        <p className="text-xs text-slate-400">
                          {requester.education.college} • {requester.education.branch}
                        </p>
                        <p className="text-[11px] text-indigo-300 mt-0.5">
                          Skills: {requester.skills.slice(0, 3).map(s => s.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(requester.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/30 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(requester.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentConns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-white">No outgoing pending requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentConns.map(conn => {
                const receiver = allUsers.find(u => u.id === conn.receiverId);
                if (!receiver) return null;

                return (
                  <div
                    key={conn.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={receiver.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                        alt={receiver.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm">{receiver.name}</h3>
                        <p className="text-xs text-slate-400">
                          {receiver.education.college} • {receiver.city}
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20 inline-block mt-1">
                          Awaiting acceptance
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(receiver.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="space-y-4">
          {blockedConns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-white">No blocked users</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blockedConns.map(conn => {
                const blocked = allUsers.find(u => u.id === conn.receiverId);
                if (!blocked) return null;

                return (
                  <div
                    key={conn.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-white text-sm">{blocked.name}</h3>
                      <p className="text-xs text-slate-500">Blocked from messaging & connection</p>
                    </div>

                    <button
                      onClick={() => handleRemove(blocked.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  Users,
  Check,
  CheckCheck,
  Smile,
  Shield,
  Clock,
  Sparkles,
  Plus,
  X,
  UserPlus,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { Message, User, Team } from '../types';

interface ChatPageProps {
  initialChatUserId?: string;
  initialTeamId?: string;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  initialChatUserId,
  initialTeamId,
}) => {
  const { currentUser, allUsers, refreshState } = useAuth();

  // Find accepted connections
  const acceptedConns = storage.getConnections(currentUser.id).filter(c => c.status === 'ACCEPTED');
  const connectedUsers = acceptedConns.map(c => {
    const otherId = c.requesterId === currentUser.id ? c.receiverId : c.requesterId;
    return allUsers.find(u => u.id === otherId);
  }).filter(Boolean) as User[];

  // Find user teams
  const userTeams = storage.getTeams().filter(
    t => t.creatorId === currentUser.id || t.members.some(m => m.userId === currentUser.id)
  );

  const [chatType, setChatType] = useState<'direct' | 'team'>(initialTeamId ? 'team' : 'direct');
  const [activeUserId, setActiveUserId] = useState<string>(
    initialChatUserId || (connectedUsers[0]?.id || '')
  );
  const [activeTeamId, setActiveTeamId] = useState<string>(
    initialTeamId || (userTeams[0]?.id || '')
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [typingPeerName, setTypingPeerName] = useState('');

  // Group creation modal state
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<'Hackathon' | 'Capstone Project' | 'Study Group' | 'Startup Idea'>('Hackathon');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation
  useEffect(() => {
    if (chatType === 'direct' && activeUserId) {
      const conv = storage.getConversation(currentUser.id, activeUserId);
      setMessages(conv);
      storage.markMessagesRead(currentUser.id, activeUserId);
      refreshState();
    } else if (chatType === 'team' && activeTeamId) {
      const teamMsgs = storage.getTeamMessages(activeTeamId);
      setMessages(teamMsgs);
    }
  }, [chatType, activeUserId, activeTeamId, currentUser.id, refreshState]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPeerTyping]);

  const activeUser = allUsers.find(u => u.id === activeUserId);
  const activeTeam = userTeams.find(t => t.id === activeTeamId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (chatType === 'direct' && activeUserId) {
      const sentMsg = storage.sendMessage(currentUser.id, activeUserId, inputText.trim());
      setMessages(prev => [...prev, sentMsg]);
      setInputText('');
      refreshState();

      // Trigger realistic simulation reply from peer
      setIsPeerTyping(true);
      setTypingPeerName(activeUser?.name || 'Peer');
      setTimeout(() => {
        setIsPeerTyping(false);
        const replyPool = [
          `Hey ${currentUser.name.split(' ')[0]}! That sounds great. Let's schedule a call to sync on the architecture!`,
          `Totally agree! I was checking out the tech stack and think we can build a strong prototype.`,
          `Thanks for reaching out! Let's definitely submit this for the upcoming hackathon round.`,
          `Awesome! I'll push the boilerplate code to GitHub tonight.`
        ];
        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
        const replyMsg = storage.sendMessage(activeUserId, currentUser.id, randomReply);
        setMessages(prev => [...prev, replyMsg]);
        refreshState();
      }, 1400);

    } else if (chatType === 'team' && activeTeamId) {
      const teamMsg = storage.sendMessage(currentUser.id, undefined, inputText.trim(), activeTeamId);
      setMessages(prev => [...prev, teamMsg]);
      setInputText('');
      refreshState();

      // Trigger realistic reply from another teammate in group chat
      if (activeTeam && activeTeam.members.length > 1) {
        const otherMembers = activeTeam.members.filter(m => m.userId !== currentUser.id);
        if (otherMembers.length > 0) {
          const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
          const memberUser = allUsers.find(u => u.id === randomMember.userId) || randomMember.user;
          setIsPeerTyping(true);
          setTypingPeerName(memberUser?.name || 'Teammate');
          setTimeout(() => {
            setIsPeerTyping(false);
            const teamReplies = [
              `Got it! I am on it. Working on my assigned tasks now!`,
              `Awesome suggestion! Let's incorporate that into our project milestone.`,
              `I can take care of the backend API and database schemas for this part.`,
              `Looks solid to me! Let's connect on a quick call after classes today.`,
              `Pushed my latest updates to the Git repository! Check it out.`
            ];
            const randomTeamReply = teamReplies[Math.floor(Math.random() * teamReplies.length)];
            const replyMsg = storage.sendMessage(randomMember.userId, undefined, randomTeamReply, activeTeamId);
            setMessages(prev => [...prev, replyMsg]);
            refreshState();
          }, 1500);
        }
      }
    }
  };

  const handleCreateGroupChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const validCollaborators = selectedMemberIds
      .map(uid => allUsers.find(user => user.id === uid))
      .filter((u): u is User => !!u)
      .map(u => ({
        userId: u.id,
        user: u,
        role: 'Collaborator',
        assignedSkills: u.skills.map(s => s.name).slice(0, 2),
        joinedAt: new Date().toISOString(),
      }));

    const initialMembers = [
      {
        userId: currentUser.id,
        user: currentUser,
        role: 'Team Lead',
        assignedSkills: currentUser.skills.map(s => s.name).slice(0, 2),
        joinedAt: new Date().toISOString(),
      },
      ...validCollaborators,
    ];

    const newTeam = storage.createTeam({
      name: newGroupName.trim(),
      description: `Student collaboration group chat for ${newGroupName.trim()}`,
      creatorId: currentUser.id,
      requiredSkills: ['Problem Solving', 'Engineering'],
      targetSize: initialMembers.length + 1,
      type: newGroupType,
      status: 'Recruiting',
      compatibilityScore: 95,
      members: initialMembers,
    });

    // Send inaugural message
    storage.sendMessage(
      currentUser.id,
      undefined,
      `👋 Welcome to the "${newTeam.name}" group chat! Let's introduce ourselves and kick off planning!`,
      newTeam.id
    );

    refreshState();
    setShowCreateGroupModal(false);
    setNewGroupName('');
    setSelectedMemberIds([]);
    setChatType('team');
    setActiveTeamId(newTeam.id);
  };

  const toggleSelectMember = (userId: string) => {
    if (selectedMemberIds.includes(userId)) {
      setSelectedMemberIds(selectedMemberIds.filter(id => id !== userId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, userId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[78vh] grid grid-cols-1 md:grid-cols-12">
        {/* Left Sidebar: Conversations list */}
        <div className="md:col-span-4 border-r border-slate-800 flex flex-col h-full bg-slate-950/60">
          {/* Top Switcher */}
          <div className="p-4 border-b border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Student Collaboration Chat</h2>
              {chatType === 'team' && (
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-sm"
                  title="Create new group chat with teammates"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Group</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setChatType('direct')}
                className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  chatType === 'direct' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct ({connectedUsers.length})</span>
              </button>
              <button
                onClick={() => setChatType('team')}
                className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  chatType === 'team' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Groups ({userTeams.length})</span>
              </button>
            </div>
          </div>

          {/* List of Contacts / Teams */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {chatType === 'direct' ? (
              connectedUsers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <p>No active connections yet.</p>
                  <p className="mt-1">Connect with students in Discover to unlock private chat.</p>
                </div>
              ) : (
                connectedUsers.map(user => {
                  const isActive = activeUserId === user.id;
                  const conv = storage.getConversation(currentUser.id, user.id);
                  const lastMsg = conv[conv.length - 1];

                  return (
                    <button
                      key={user.id}
                      onClick={() => setActiveUserId(user.id)}
                      className={`w-full p-3.5 text-left flex items-center gap-3 transition cursor-pointer ${
                        isActive ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                        {user.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{user.name}</span>
                          {lastMsg && (
                            <span className="text-[10px] text-slate-500">
                              {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {lastMsg ? lastMsg.text : `${user.education.branch} • ${user.city}`}
                        </p>
                      </div>
                    </button>
                  );
                })
              )
            ) : (
              userTeams.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 space-y-3">
                  <p>No active team group chats yet.</p>
                  <button
                    onClick={() => setShowCreateGroupModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Group Chat</span>
                  </button>
                </div>
              ) : (
                userTeams.map(team => {
                  const isActive = activeTeamId === team.id;
                  const teamMsgs = storage.getTeamMessages(team.id);
                  const lastMsg = teamMsgs[teamMsgs.length - 1];

                  return (
                    <button
                      key={team.id}
                      onClick={() => setActiveTeamId(team.id)}
                      className={`w-full p-3.5 text-left flex items-center gap-3 transition cursor-pointer ${
                        isActive ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{team.name}</span>
                          {lastMsg && (
                            <span className="text-[10px] text-slate-500">
                              {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-400 block truncate">
                          {team.members.length} members • {team.type}
                        </span>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {lastMsg ? lastMsg.text : 'Group channel initialized.'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Right Pane: Chat History & Input */}
        <div className="md:col-span-8 flex flex-col h-full bg-slate-900">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm">
            {chatType === 'direct' && activeUser ? (
              <div className="flex items-center gap-3">
                <img
                  src={activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                  alt={activeUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{activeUser.name}</span>
                    <span className="text-[10px] px-1.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                      Verified Peer
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeUser.education.college} • {activeUser.city}
                  </p>
                </div>
              </div>
            ) : chatType === 'team' && activeTeam ? (
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>{activeTeam.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    {activeTeam.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({activeTeam.members.length} Members)
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 truncate max-w-md">
                  <span className="text-slate-500">Members:</span>
                  <span>{activeTeam.members.map(m => m.user?.name || 'Student').join(', ')}</span>
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Select a conversation or create a group</div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">End-to-End Encrypted</span>
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-400/60 mx-auto" />
                <p className="text-slate-300 font-medium">Start the conversation!</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  {chatType === 'team'
                    ? 'Say hi to your team! Coordinate tasks, share GitHub repos, and plan meeting times.'
                    : 'Discuss project goals, hackathon ideation, or technical skill sharing.'}
                </p>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                const sender = allUsers.find(u => u.id === msg.senderId);

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                        alt={sender?.name || 'Teammate'}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mt-1"
                      />
                    )}

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[78%]`}>
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1 ml-1">
                          <span className="text-[11px] font-bold text-white">
                            {sender?.name || 'Teammate'}
                          </span>
                          {sender?.education?.college && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 border border-slate-700 truncate max-w-[140px]">
                              {sender.education.college}
                            </span>
                          )}
                        </div>
                      )}

                      <div
                        className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75">
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isPeerTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 italic py-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">{typingPeerName || 'Teammate'} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={chatType === 'team' ? `Message #${activeTeam?.name || 'group'}...` : `Message ${activeUser?.name || 'peer'}...`}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Create New Group Chat Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New Group Chat</h3>
                  <p className="text-[11px] text-slate-400">Form a team channel with your college peers</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupChat} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Group / Team Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="e.g. Smart India Hackathon Group, AI Diagnostic Team"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Group Category</label>
                <select
                  value={newGroupType}
                  onChange={e => setNewGroupType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none text-xs"
                >
                  <option value="Hackathon">Hackathon Team</option>
                  <option value="Capstone Project">Capstone / Final Year Project</option>
                  <option value="Study Group">Exam & Tech Study Group</option>
                  <option value="Startup Idea">Student Startup Project</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Select Students to Add ({selectedMemberIds.length} Selected)</span>
                  <span className="text-emerald-400 text-[10px]">You are automatically the Team Lead</span>
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-2xl border border-slate-800">
                  {allUsers
                    .filter(u => u.id !== currentUser.id)
                    .map(user => {
                      const isSelected = selectedMemberIds.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => toggleSelectMember(user.id)}
                          className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition ${
                            isSelected ? 'bg-indigo-950/60 border border-indigo-500/40 text-white' : 'hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                              alt={user.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-xs">{user.name}</div>
                              <div className="text-[10px] text-slate-400">
                                {user.education.college} • {user.education.branch}
                              </div>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-emerald-600/30 transition"
                >
                  Create Group Chat Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

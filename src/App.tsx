import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MatchDetailsModal } from './components/MatchDetailsModal';
import { ReportModal } from './components/ReportModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { TrustModal } from './components/TrustModal';
import { ShareModal } from './components/ShareModal';
import { AuthModal } from './pages/AuthModal';
import { AuthLandingPage } from './pages/AuthLandingPage';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { TeamBuilderPage } from './pages/TeamBuilderPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { ChatPage } from './pages/ChatPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

import { User, MatchResult } from './types';
import { storage } from './services/storage';

function MainApp() {
  const { currentUser, isAuthenticated, refreshState } = useAuth();

  // If visitor is not logged in on their device, display the Sign In / Sign Up Gateway (Instagram-style)
  if (!isAuthenticated) {
    return <AuthLandingPage />;
  }

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modal states
  const [selectedMatch, setSelectedMatch] = useState<{
    user: User;
    result: MatchResult;
  } | null>(null);

  const [reportingUser, setReportingUser] = useState<User | null>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Chat navigation params
  const [chatDirectUserId, setChatDirectUserId] = useState<string | undefined>();
  const [chatTeamId, setChatTeamId] = useState<string | undefined>();

  const handleOpenChatWithUser = (targetUserId: string) => {
    setChatDirectUserId(targetUserId);
    setChatTeamId(undefined);
    setCurrentTab('chat');
  };

  const handleOpenTeamChat = (teamId: string) => {
    setChatTeamId(teamId);
    setChatDirectUserId(undefined);
    setCurrentTab('chat');
  };

  const handleConnectFromModal = (targetUserId: string) => {
    storage.sendConnectionRequest(currentUser.id, targetUserId);
    refreshState();
  };

  const handleReportUser = (userId: string) => {
    const target = storage.getUserById(userId);
    if (target) {
      setSelectedMatch(null);
      setReportingUser(target);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenArchitecture={() => setShowArchitecture(true)}
        onOpenTrustModal={() => setShowTrustModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenShare={() => setShowShareModal(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentTab('discover')}
            onOpenArchitecture={() => setShowArchitecture(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            setCurrentTab={setCurrentTab}
            onViewMatchDetails={(u, res) => setSelectedMatch({ user: u, result: res })}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverPage
            onViewMatchDetails={(u, res) => setSelectedMatch({ user: u, result: res })}
          />
        )}

        {currentTab === 'team-builder' && (
          <TeamBuilderPage onOpenTeamChat={handleOpenTeamChat} />
        )}

        {currentTab === 'connections' && (
          <ConnectionsPage
            onOpenChat={handleOpenChatWithUser}
            onReport={handleReportUser}
          />
        )}

        {currentTab === 'chat' && (
          <ChatPage
            initialChatUserId={chatDirectUserId}
            initialTeamId={chatTeamId}
          />
        )}

        {currentTab === 'projects' && <ProjectsPage />}

        {currentTab === 'skill-gap' && (
          <SkillGapPage onOpenChat={handleOpenChatWithUser} />
        )}

        {currentTab === 'resume-upload' && (
          <ResumeUploadPage onSuccess={() => setCurrentTab('profile')} />
        )}

        {currentTab === 'profile' && (
          <ProfilePage onGoToResume={() => setCurrentTab('resume-upload')} />
        )}

        {currentTab === 'settings' && <SettingsPage />}

        {currentTab === 'admin' && <AdminPage />}
      </main>

      {/* Footer */}
      <Footer
        onOpenArchitecture={() => setShowArchitecture(true)}
        setCurrentTab={setCurrentTab}
      />

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          user={selectedMatch.user}
          matchResult={selectedMatch.result}
          currentUser={currentUser}
          connectionStatus={storage.getConnectionStatus(currentUser.id, selectedMatch.user.id)}
          onClose={() => setSelectedMatch(null)}
          onConnect={handleConnectFromModal}
          onOpenChat={handleOpenChatWithUser}
          onReport={handleReportUser}
        />
      )}

      {/* Report & Block Modal */}
      {reportingUser && (
        <ReportModal
          targetUser={reportingUser}
          currentUserId={currentUser.id}
          onClose={() => setReportingUser(null)}
          onSuccess={() => refreshState()}
        />
      )}

      {/* Architecture & Engineering Blueprint Viewer */}
      {showArchitecture && (
        <ArchitectureModal onClose={() => setShowArchitecture(false)} />
      )}

      {/* Trust & Scam Prevention Modal */}
      {showTrustModal && (
        <TrustModal onClose={() => setShowTrustModal(false)} />
      )}

      {/* Share / Invite Friend Modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setCurrentTab('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

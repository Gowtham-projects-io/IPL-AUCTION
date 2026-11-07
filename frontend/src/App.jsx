import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuctionSocketProvider } from './context/AuctionSocketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CreateRoomPage } from './pages/CreateRoomPage';
import { JoinRoomPage } from './pages/JoinRoomPage';
import { PublicRoomsPage } from './pages/PublicRoomsPage';
import { MegaAuctionSetupPage } from './pages/MegaAuctionSetupPage';
import { MiniAuctionSetupPage } from './pages/MiniAuctionSetupPage';
import { AuctionLobbyPage } from './pages/AuctionLobbyPage';
import { LiveAuctionPage } from './pages/LiveAuctionPage';
import { TeamSquadPage } from './pages/TeamSquadPage';
import { PlayerDatabasePage } from './pages/PlayerDatabasePage';
import { AuctionResultsPage } from './pages/AuctionResultsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PlayableDemoPage } from './pages/PlayableDemoPage';

import { api } from './services/api';

const AppContent = () => {
  const { user, guestLogin } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [claimedTeamId, setClaimedTeamId] = useState(null);
  const [createPresetMode, setCreatePresetMode] = useState('mega');

  // Ensure a guest user exists if user is not logged in
  useEffect(() => {
    if (!user) {
      guestLogin().catch(() => {});
    }
  }, [user]);

  // Check URL query parameters for invite links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      api.getRoomByCode(code).then((room) => {
        setCurrentRoom(room);
        setActivePage('lobby');
      }).catch((e) => console.error(e));
    }
  }, []);

  const handleRoomCreated = (room) => {
    setCurrentRoom(room);
    setActivePage('lobby');
  };

  const handleRoomJoined = (room) => {
    setCurrentRoom(room);
    setActivePage('lobby');
  };

  const handleClaimTeam = async (teamId) => {
    if (!currentRoom) return;
    const uname = user?.username || 'FranchiseBidder';
    try {
      await api.claimTeam(currentRoom.id, teamId, uname);
      setClaimedTeamId(teamId);
    } catch (e) {
      alert(e.message || 'Failed to claim team');
    }
  };

  const handleCreateWithMode = (mode) => {
    setCreatePresetMode(mode);
    setActivePage('create-room');
  };

  const username = user?.username || 'FranchiseBidder';

  return (
    <div className="min-h-screen flex flex-col bg-fjord-900 text-silver-soft stadium-bg">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onLaunchDemo={() => setActivePage('demo')}
          />
        )}

        {activePage === 'demo' && (
          <PlayableDemoPage setActivePage={setActivePage} />
        )}

        {activePage === 'create-room' && (
          <CreateRoomPage
            onRoomCreated={handleRoomCreated}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'join-room' && (
          <JoinRoomPage
            onRoomJoined={handleRoomJoined}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'public-rooms' && (
          <PublicRoomsPage
            onRoomSelect={handleRoomJoined}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'mega-setup' && (
          <MegaAuctionSetupPage
            setActivePage={setActivePage}
            onCreateWithMode={handleCreateWithMode}
          />
        )}

        {activePage === 'mini-setup' && (
          <MiniAuctionSetupPage
            setActivePage={setActivePage}
            onCreateWithMode={handleCreateWithMode}
          />
        )}

        {activePage === 'lobby' && currentRoom && (
          <AuctionLobbyPage
            room={currentRoom}
            username={username}
            claimedTeamId={claimedTeamId}
            onClaimTeam={handleClaimTeam}
            onEnterAuction={() => setActivePage('live-auction')}
          />
        )}

        {activePage === 'live-auction' && currentRoom && (
          <AuctionSocketProvider roomId={currentRoom.id}>
            <LiveAuctionPage
              room={currentRoom}
              username={username}
              claimedTeamId={claimedTeamId}
              onClaimTeam={handleClaimTeam}
              onBackToLobby={() => setActivePage('lobby')}
            />
          </AuctionSocketProvider>
        )}

        {activePage === 'squads' && (
          <TeamSquadPage currentRoomId={currentRoom?.id} />
        )}

        {activePage === 'database' && (
          <PlayerDatabasePage />
        )}

        {activePage === 'results' && (
          <AuctionResultsPage currentRoomId={currentRoom?.id} />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage />
        )}

        {activePage === 'profile' && (
          <UserProfilePage setActivePage={setActivePage} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


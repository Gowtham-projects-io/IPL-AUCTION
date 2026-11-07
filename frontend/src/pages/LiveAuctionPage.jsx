import React, { useState, useEffect } from 'react';
import { 
  CenterAuctionStage 
} from '../components/live-auction/CenterAuctionStage';
import { 
  LeftTeamRoster 
} from '../components/live-auction/LeftTeamRoster';
import { 
  RightBiddingPanel 
} from '../components/live-auction/RightBiddingPanel';
import { 
  BottomUpcomingQueue 
} from '../components/live-auction/BottomUpcomingQueue';
import { 
  SoldCelebrationModal 
} from '../components/live-auction/SoldCelebrationModal';
import { 
  HostControlsBar 
} from '../components/live-auction/HostControlsBar';
import { useAuctionSocket } from '../context/AuctionSocketContext';
import { api } from '../services/api';
import { Volume2, VolumeX, Shield, ArrowLeft } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

export const LiveAuctionPage = ({ room, username, claimedTeamId, onClaimTeam, onBackToLobby }) => {
  const {
    auctionState,
    isConnected,
    lastBidError,
    chatMessages,
    soldModalData,
    setSoldModalData,
    sendBid,
    sendHostControl,
    sendChatMessage
  } = useAuctionSocket();

  const [teams, setTeams] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await api.getTeams();
        setTeams(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTeams();
  }, []);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handlePlaceBid = (amountLakh) => {
    if (!claimedTeamId) return;
    sendBid(claimedTeamId, username, amountLakh);
  };

  const handleHostControl = (action, param = null) => {
    sendHostControl(action, param);
  };

  const handleSendChat = (text) => {
    sendChatMessage(username, claimedTeamId, text);
  };

  const currPlayer = auctionState?.current_player;

  return (
    <div className="max-w-[1550px] mx-auto px-2 sm:px-4 py-4 space-y-4">
      
      {/* Top Bar: Room Info & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-teal-border/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="p-2 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-mist-grey hover:text-mint-glacier transition-colors"
            title="Back to Lobby"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl text-silver-soft uppercase tracking-wide">
                {room.name}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-fjord-950 text-mint-ice border border-teal-border">
                {room.room_code}
              </span>
            </div>
            <p className="text-[11px] text-mist-grey">
              Mode: <span className="text-mint-glacier uppercase font-semibold">{room.auction_mode}</span> • 10 IPL Franchises Live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Synthesizer toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-mist-grey hover:text-mint-glacier transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-mint-glacier" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Connection status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-panel border border-teal-border text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-mist-grey font-medium text-[11px]">
              {isConnected ? 'LIVE FEED' : 'RECONNECTING'}
            </span>
          </div>
        </div>
      </div>

      {/* Host Action Bar */}
      <HostControlsBar 
        status={auctionState?.status || 'waiting'}
        onControl={handleHostControl}
      />

      {/* 3-Column Broadcast Grid: Left Roster (3 cols) | Center Stage (6 cols) | Right Bidding (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: 10 IPL Franchises Roster (3 cols) */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <LeftTeamRoster
            teams={teams}
            teamStates={auctionState?.team_states || {}}
            highestBidder={auctionState?.highest_bidder}
            claimedTeamId={claimedTeamId}
          />
        </div>

        {/* Center Column: Live Auction Spotlight Stage (6 cols) */}
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          <CenterAuctionStage
            player={currPlayer}
            currentBidLakh={auctionState?.current_bid_lakh || 0}
            currentBidCr={auctionState?.current_bid_cr || 0.0}
            highestBidder={auctionState?.highest_bidder}
            countdown={auctionState?.countdown || 0}
            maxCountdown={auctionState?.max_countdown || 10}
            status={auctionState?.status || 'waiting'}
            teams={teams}
          />

          {/* Bottom Queue: Upcoming Sets, Sold and Unsold History */}
          <BottomUpcomingQueue
            upcomingPlayers={auctionState?.upcoming_players || []}
            soldPlayers={auctionState?.sold_players || []}
            unsoldPlayers={auctionState?.unsold_players || []}
            onReauctionPlayer={(pId) => handleHostControl('reauction', pId)}
            isHost={true}
          />
        </div>

        {/* Right Column: Dynamic Bid Paddle & Chat Panel (3 cols) */}
        <div className="lg:col-span-3 order-3">
          <RightBiddingPanel
            claimedTeamId={claimedTeamId}
            onClaimTeam={onClaimTeam}
            onPlaceBid={handlePlaceBid}
            nextMinBidLakh={auctionState?.next_min_bid_lakh || currPlayer?.base_price_lakh || 30}
            currentBidLakh={auctionState?.current_bid_lakh || 0}
            basePriceLakh={currPlayer?.base_price_lakh || 30}
            highestBidder={auctionState?.highest_bidder}
            bidHistory={auctionState?.bid_history || []}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChat}
            lastError={lastBidError}
            username={username}
            teams={teams}
          />
        </div>

      </div>

      {/* Sold Fanfare Modal */}
      <SoldCelebrationModal
        data={soldModalData}
        onClose={() => setSoldModalData(null)}
      />

    </div>
  );
};


import React from 'react';
import { 
  Clock, Shield, Award, User, Flame, Globe, CheckCircle2, XCircle, Sparkles 
} from 'lucide-react';

export const CenterAuctionStage = ({ 
  player, 
  currentBidLakh, 
  currentBidCr, 
  highestBidder, 
  countdown, 
  maxCountdown = 10,
  status,
  teams = []
}) => {
  if (!player) {
    return (
      <div className="glass-panel-elevated rounded-2xl p-8 flex flex-col items-center justify-center min-h-[420px] text-center">
        <div className="w-16 h-16 rounded-full bg-teal-panel border border-mint-glacier/30 flex items-center justify-center text-mint-glacier mb-4 animate-bounce">
          <Shield className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-2xl text-silver-soft mb-2">AUCTION STAGE STANDBY</h3>
        <p className="text-sm text-mist-grey max-w-md">
          The auctioneer will call the next player to the podium shortly. Get your paddles ready!
        </p>
      </div>
    );
  }

  const highestTeam = teams.find(t => t.id === highestBidder);
  const timerPercentage = Math.max(0, Math.min(100, (countdown / maxCountdown) * 100));
  const isUrgent = countdown <= 3 && countdown > 0;

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 relative overflow-hidden border border-mint-glacier/30 shadow-2xl">
      
      {/* Top Bar: Set badge & Countdown Timer */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-teal-border/50">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-teal-panel border border-teal-border text-xs font-mono font-bold text-mint-ice">
            SET: {player.auction_set}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-mint-glacier/10 text-mint-glacier text-[11px] font-semibold">
            {player.auction_category}
          </span>
          {player.data_status && (
            <span className="hidden sm:inline-flex text-[10px] text-mist-grey bg-fjord-950/60 px-2 py-0.5 rounded border border-teal-border/40">
              {player.data_status.includes("Confirmed") ? "✓ Confirmed Data" : "Projection"}
            </span>
          )}
        </div>

        {/* Dynamic 10s Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono font-bold text-lg">
            <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-400 animate-spin' : 'text-mint-glacier'}`} />
            <span className={`${isUrgent ? 'text-red-400 text-2xl animate-pulse' : 'text-mint-ice'}`}>
              00:{countdown.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="w-24 h-2.5 bg-fjord-950 rounded-full overflow-hidden border border-teal-border p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isUrgent ? 'bg-red-500' : 'bg-mint-glacier'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Player Spotlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Player Avatar & Badges */}
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-gradient-to-b from-teal-panel to-fjord-950 border-2 border-mint-glacier/40 p-2 overflow-hidden shadow-xl mint-glow-sm flex items-center justify-center">
              <img 
                src={player.player_image || "/assets/default_player.png"} 
                alt={player.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {player.is_overseas ? (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-900/90 border border-cyan-400 text-[10px] font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3" /> Overseas
              </span>
            ) : (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-900/90 border border-amber-400 text-[10px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1">
                🇮🇳 Indian
              </span>
            )}
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-panel text-mint-glacier border border-teal-border">
            {player.role}
          </span>
        </div>

        {/* Center: Player Details & Stats */}
        <div className="md:col-span-8 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-silver-soft tracking-wide uppercase">
                {player.name}
              </h2>
            </div>
            <p className="text-xs text-mist-grey font-medium flex items-center gap-2 mt-0.5">
              <span>{player.country}</span>
              {player.state_association && <span>• {player.state_association}</span>}
              <span>• Age: {player.age}</span>
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-teal-panel/80 p-2 rounded-lg border border-teal-border/40">
              <span className="text-[10px] text-mist-grey uppercase block">Batting</span>
              <span className="font-bold text-silver-soft">{player.batting_style || 'RHB'}</span>
            </div>
            <div className="bg-teal-panel/80 p-2 rounded-lg border border-teal-border/40">
              <span className="text-[10px] text-mist-grey uppercase block">Bowling</span>
              <span className="font-bold text-silver-soft truncate block" title={player.bowling_style}>
                {player.bowling_style || 'None'}
              </span>
            </div>
            <div className="bg-teal-panel/80 p-2 rounded-lg border border-teal-border/40">
              <span className="text-[10px] text-mist-grey uppercase block">IPL Matches</span>
              <span className="font-bold text-mint-glacier">{player.ipl_matches || 0}</span>
            </div>
            <div className="bg-teal-panel/80 p-2 rounded-lg border border-teal-border/40">
              <span className="text-[10px] text-mist-grey uppercase block">Past Franchise</span>
              <span className="font-bold text-silver-soft truncate block">
                {player.recent_team || player.previous_teams || 'Fresh Debut'}
              </span>
            </div>
          </div>

          {/* Base Price & Live Bid Podium */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-fjord-950 via-teal-panel to-fjord-950 border border-teal-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div>
              <span className="text-[11px] uppercase tracking-wider text-mist-grey block font-semibold">
                BASE RESERVE PRICE
              </span>
              <span className="font-display font-bold text-lg text-silver-soft">
                ₹{player.base_price_lakh} Lakh <span className="text-xs text-mist-grey font-normal font-sans">(₹{player.base_price_cr} Cr)</span>
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-mint-glacier block font-bold flex items-center justify-center sm:justify-end gap-1">
                <Sparkles className="w-3.5 h-3.5" /> CURRENT HIGHEST BID
              </span>
              <div className="flex items-baseline justify-center sm:justify-end gap-2">
                <span className="font-display font-black text-3xl md:text-4xl text-mint-ice tracking-tight animate-pulse">
                  {currentBidLakh > 0 ? `₹${currentBidCr} Cr` : `₹${player.base_price_cr} Cr`}
                </span>
                <span className="text-xs text-mint-glacier font-mono">
                  ({currentBidLakh > 0 ? `₹${currentBidLakh}L` : `₹${player.base_price_lakh}L`})
                </span>
              </div>
            </div>

          </div>

          {/* Current Leading Bidder Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal-panel/90 border border-teal-border">
            <span className="text-xs text-mist-grey font-semibold">LEADER ON BID:</span>
            {highestBidder ? (
              <div className="flex items-center gap-2">
                <span 
                  className="px-2.5 py-1 rounded text-xs font-black tracking-wider text-white"
                  style={{ backgroundColor: highestTeam?.primary_color || '#004BA0' }}
                >
                  {highestBidder}
                </span>
                <span className="text-xs font-bold text-mint-ice">
                  {highestTeam?.name || highestBidder}
                </span>
              </div>
            ) : (
              <span className="text-xs text-mist-grey italic">Awaiting first opening bid...</span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};


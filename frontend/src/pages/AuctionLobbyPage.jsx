import React, { useState, useEffect } from 'react';
import { 
  Users, Copy, Check, Shield, Play, Globe, Lock, ArrowRight, Share2, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

export const AuctionLobbyPage = ({ room, username, onEnterAuction, onClaimTeam, claimedTeamId }) => {
  const [teams, setTeams] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tList, pList] = await Promise.all([
          api.getTeams(),
          api.getRoomParticipants(room.id)
        ]);
        setTeams(tList);
        setParticipants(pList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 3000); // Polling lobby participants
    return () => clearInterval(interval);
  }, [room.id]);

  const copyRoomLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?code=${room.room_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Lobby Header & Room Code Box */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-mint-glacier/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-fjord-950 text-mint-ice border border-teal-border">
              {room.auction_mode.toUpperCase()} AUCTION ARENA
            </span>
            <span className="text-xs text-mist-grey">• Purse: ₹{room.purse_cr} Cr/team</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-silver-soft uppercase tracking-wide">
            {room.name}
          </h2>

          <p className="text-xs text-mist-grey mt-1">
            Pick your franchise paddle, wait for participants, and enter the live bidding floor.
          </p>
        </div>

        {/* Room Code & Invite Link Box */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-fjord-950 border border-teal-border flex items-center justify-between gap-4 w-full sm:w-auto">
            <div>
              <span className="text-[10px] text-mist-grey uppercase block">ROOM CODE</span>
              <span className="font-mono font-black text-xl text-mint-glacier tracking-widest">
                {room.room_code}
              </span>
            </div>
            <button
              onClick={copyRoomLink}
              className="p-2 rounded-xl bg-teal-panel hover:bg-teal-hover text-silver-soft hover:text-mint-glacier transition-colors border border-teal-border"
              title="Copy Invite Link"
            >
              {copied ? <Check className="w-5 h-5 text-mint-glacier" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={onEnterAuction}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 font-display font-black text-base uppercase tracking-wider transition-all shadow-xl mint-glow flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Enter Auction Arena</span>
          </button>
        </div>
      </div>

      {/* 10 Franchises Claiming Grid */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-teal-border/40 mb-4">
          <h3 className="font-display font-extrabold text-xl text-silver-soft uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-mint-glacier" />
            <span>Select Franchise Paddle (10 Teams)</span>
          </h3>
          <span className="text-xs text-mist-grey font-mono">
            {claimedTeamId ? `You hold: ${claimedTeamId}` : 'No team claimed yet'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {teams.map((t) => {
            const claim = participants.find(p => p.claimed_team_id === t.id);
            const isClaimedByMe = claimedTeamId === t.id;
            const isClaimedByOther = claim && !isClaimedByMe;

            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] ${
                  isClaimedByMe
                    ? 'bg-mint-glacier/15 border-mint-glacier shadow-md mint-glow-sm'
                    : isClaimedByOther
                    ? 'bg-fjord-950/70 border-teal-border/30 opacity-75'
                    : 'glass-card border-teal-border/60 hover:border-mint-glacier/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-sm"
                      style={{ backgroundColor: t.primary_color || '#102D32' }}
                    >
                      {t.id}
                    </span>
                    <span className="text-[10px] text-mist-grey font-mono">
                      ₹{t.default_purse_cr} Cr
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-silver-soft leading-tight">{t.name}</h4>
                </div>

                <div className="mt-3 pt-2 border-t border-teal-border/30">
                  {isClaimedByMe ? (
                    <span className="text-[11px] font-bold text-mint-glacier block text-center uppercase tracking-wider">
                      ✓ Your Team
                    </span>
                  ) : isClaimedByOther ? (
                    <span className="text-[10px] text-mist-grey block truncate text-center">
                      Held by: <span className="text-silver-soft font-semibold">{claim.username}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onClaimTeam(t.id)}
                      className="w-full py-1.5 rounded-lg bg-teal-panel hover:bg-mint-glacier text-silver-soft hover:text-fjord-950 text-xs font-bold transition-all border border-teal-border hover:border-mint-glacier"
                    >
                      Claim {t.id}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};


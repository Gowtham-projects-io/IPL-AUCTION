import React from 'react';
import { Shield, Users, Globe, IndianRupee } from 'lucide-react';

export const LeftTeamRoster = ({ teams = [], teamStates = {}, highestBidder, claimedTeamId }) => {
  return (
    <div className="glass-panel-elevated rounded-2xl p-4 flex flex-col h-full border border-teal-border/60">
      <div className="flex items-center justify-between pb-3 border-b border-teal-border/40 mb-3">
        <h3 className="font-display font-bold text-sm tracking-wider text-silver-soft uppercase flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-mint-glacier" />
          <span>FRANCHISE STANDINGS (10)</span>
        </h3>
        <span className="text-[10px] text-mist-grey font-mono">PURSE & SLOTS</span>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[580px]">
        {teams.map((team) => {
          const state = teamStates[team.id] || {
            remaining_purse_cr: team.default_purse_cr || 120.0,
            squad_count: 0,
            overseas_count: 0
          };

          const isHighest = highestBidder === team.id;
          const isUserTeam = claimedTeamId === team.id;

          return (
            <div
              key={team.id}
              className={`p-2.5 rounded-xl border transition-all ${
                isHighest
                  ? 'bg-mint-glacier/15 border-mint-glacier shadow-md mint-glow-sm scale-[1.01]'
                  : isUserTeam
                  ? 'bg-teal-hover border-mint-glacier/40'
                  : 'bg-teal-panel/70 border-teal-border/40 hover:bg-teal-panel'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black tracking-wider text-white shadow-sm"
                    style={{ backgroundColor: team.primary_color || '#102D32' }}
                  >
                    {team.id}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-silver-soft block leading-none truncate max-w-[110px]">
                      {team.name}
                    </span>
                    {isUserTeam && (
                      <span className="text-[9px] text-mint-glacier font-bold uppercase tracking-widest">
                        Your Franchise
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-extrabold text-sm text-mint-ice block leading-none">
                    ₹{state.remaining_purse_cr.toFixed(2)} Cr
                  </span>
                  <span className="text-[9px] text-mist-grey">Remaining Purse</span>
                </div>
              </div>

              {/* Roster Progress Badges */}
              <div className="flex items-center justify-between text-[10px] text-mist-grey pt-1.5 border-t border-teal-border/30">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-silver-soft" />
                  <span className="font-semibold text-silver-soft">{state.squad_count}/25</span>
                  <span className="text-[9px] text-mist-grey">squad</span>
                </div>

                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span className="font-semibold text-silver-soft">{state.overseas_count}/8</span>
                  <span className="text-[9px] text-mist-grey">overseas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


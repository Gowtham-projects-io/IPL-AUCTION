import React, { useState } from 'react';
import { FastForward, CheckCircle2, XCircle, RotateCcw, User, Globe } from 'lucide-react';

export const BottomUpcomingQueue = ({
  upcomingPlayers = [],
  soldPlayers = [],
  unsoldPlayers = [],
  onReauctionPlayer,
  isHost
}) => {
  const [tab, setTab] = useState('upcoming'); // 'upcoming', 'sold', 'unsold'

  return (
    <div className="glass-panel-elevated rounded-2xl p-4 border border-teal-border/60">
      
      {/* Header and Filter Buttons */}
      <div className="flex items-center justify-between pb-3 border-b border-teal-border/40 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              tab === 'upcoming'
                ? 'bg-mint-glacier text-fjord-950 font-black shadow-sm'
                : 'text-mist-grey hover:text-silver-soft'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Upcoming Queue ({upcomingPlayers.length})</span>
          </button>

          <button
            onClick={() => setTab('sold')}
            className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              tab === 'sold'
                ? 'bg-gold-sold text-fjord-950 font-black shadow-sm'
                : 'text-mist-grey hover:text-silver-soft'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Sold History ({soldPlayers.length})</span>
          </button>

          <button
            onClick={() => setTab('unsold')}
            className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              tab === 'unsold'
                ? 'bg-red-500 text-white font-black shadow-sm'
                : 'text-mist-grey hover:text-silver-soft'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Unsold Pool ({unsoldPlayers.length})</span>
          </button>
        </div>

        <span className="text-[10px] text-mist-grey font-mono hidden sm:inline-block">
          Official Pool Tracking
        </span>
      </div>

      {/* Tab Panels */}
      {tab === 'upcoming' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {upcomingPlayers.length === 0 ? (
            <div className="col-span-full py-4 text-center text-xs text-mist-grey italic">
              No upcoming players in the immediate queue.
            </div>
          ) : (
            upcomingPlayers.map((p, idx) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-teal-panel/80 border border-teal-border/40 hover:border-mint-glacier/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-mist-grey mb-1">
                    <span className="font-mono text-mint-ice font-bold">{p.auction_set}</span>
                    <span>#{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-xs text-silver-soft truncate">{p.name}</h4>
                  <p className="text-[10px] text-mist-grey flex items-center gap-1">
                    <span>{p.role}</span>
                    <span>•</span>
                    <span>{p.country}</span>
                  </p>
                </div>
                <div className="mt-2 pt-1 border-t border-teal-border/30 text-right">
                  <span className="text-[10px] text-mint-glacier font-mono font-bold">
                    ₹{p.base_price_lakh}L Base
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'sold' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-[160px] overflow-y-auto pr-1">
          {soldPlayers.length === 0 ? (
            <div className="col-span-full py-4 text-center text-xs text-mist-grey italic">
              No players sold yet in this auction room.
            </div>
          ) : (
            soldPlayers.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-teal-panel/80 border border-gold-sold/30 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-silver-soft truncate">{item.player.name}</h4>
                  <p className="text-[10px] text-mist-grey">{item.player.role} • {item.player.country}</p>
                  <span className="px-1.5 py-0.2 rounded bg-fjord-950 text-[10px] font-black text-gold-sold border border-gold-sold/30 inline-block mt-1">
                    {item.team_id}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-display font-extrabold text-sm text-gold-sold block leading-none">
                    ₹{item.price_cr} Cr
                  </span>
                  <span className="text-[9px] text-mist-grey font-mono">(₹{item.price_lakh}L)</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'unsold' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-[160px] overflow-y-auto pr-1">
          {unsoldPlayers.length === 0 ? (
            <div className="col-span-full py-4 text-center text-xs text-mist-grey italic">
              No unsold players yet.
            </div>
          ) : (
            unsoldPlayers.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-teal-panel/80 border border-red-500/30 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-silver-soft truncate">{p.name}</h4>
                  <p className="text-[10px] text-mist-grey">{p.role} • ₹{p.base_price_lakh}L</p>
                </div>

                {isHost && (
                  <button
                    onClick={() => onReauctionPlayer(p.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-mint-glacier/20 hover:bg-mint-glacier text-mint-ice hover:text-fjord-950 text-[10px] font-bold transition-all border border-mint-glacier/40"
                    title="Nominate back to active auction queue"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-auction</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

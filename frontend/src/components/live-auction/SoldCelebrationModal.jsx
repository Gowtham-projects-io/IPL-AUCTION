import React from 'react';
import { Trophy, CheckCircle, Sparkles, X } from 'lucide-react';

export const SoldCelebrationModal = ({ data, onClose }) => {
  if (!data) return null;

  const { player, team_id, price_lakh, price_cr } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fjord-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-gold-sold/60 shadow-2xl relative text-center gold-glow">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-teal-panel text-mist-grey hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Fanfare Gold Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-600 via-gold-sold to-amber-300 flex items-center justify-center text-fjord-950 shadow-xl mb-4 animate-bounce">
          <Trophy className="w-10 h-10 font-bold" />
        </div>

        <span className="px-3 py-1 rounded-full bg-gold-sold/20 text-gold-sold text-xs font-black tracking-widest uppercase border border-gold-sold/40 inline-block mb-2">
          GOING ONCE... TWICE... SOLD!
        </span>

        <h3 className="font-display font-extrabold text-3xl text-silver-soft uppercase tracking-wide">
          {player.name}
        </h3>
        
        <p className="text-xs text-mist-grey mb-6">
          {player.role} • {player.country} • Set {player.auction_set}
        </p>

        {/* Winning Franchise & Final Price Box */}
        <div className="p-4 rounded-2xl bg-teal-panel/90 border border-gold-sold/40 mb-6 space-y-2">
          <span className="text-[11px] text-mist-grey uppercase tracking-wider block font-semibold">
            ACQUIRED BY FRANCHISE
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-lg text-base font-black text-white bg-fjord-950 border border-teal-border">
              {team_id}
            </span>
          </div>

          <div className="pt-2 border-t border-teal-border/40">
            <span className="text-[10px] text-mist-grey uppercase block">WINNING HAMMER BID</span>
            <span className="font-display font-black text-4xl text-gold-sold tracking-tight">
              ₹{price_cr} CRORE
            </span>
            <span className="text-xs text-mist-grey block font-mono">
              (₹{price_lakh} Lakh)
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-sold to-amber-500 hover:from-amber-400 hover:to-gold-sold text-fjord-950 font-display font-bold text-base tracking-wider uppercase shadow-lg transition-all"
        >
          Proceed to Next Player
        </button>

      </div>
    </div>
  );
};

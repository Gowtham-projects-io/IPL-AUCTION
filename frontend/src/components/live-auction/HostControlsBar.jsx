import React from 'react';
import { Play, Pause, FastForward, Gavel, XCircle, RotateCcw } from 'lucide-react';

export const HostControlsBar = ({ status, onControl }) => {
  return (
    <div className="glass-panel rounded-xl p-3 border border-mint-glacier/30 flex flex-wrap items-center justify-between gap-3 bg-teal-panel/90">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-mint-glacier animate-ping" />
        <span className="font-display font-bold text-xs uppercase tracking-wider text-silver-soft">
          AUCTIONEER DESK CONTROLS
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-fjord-950 text-mint-ice border border-teal-border font-mono uppercase">
          Status: {status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {status === 'active' ? (
          <button
            onClick={() => onControl('pause')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-panel hover:bg-teal-hover text-silver-soft text-xs font-bold border border-teal-border transition-all"
          >
            <Pause className="w-3.5 h-3.5 text-amber-400" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={() => onControl(status === 'paused' ? 'resume' : 'start')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-glacier hover:bg-mint-hover text-fjord-950 text-xs font-bold transition-all shadow-sm mint-glow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{status === 'paused' ? 'Resume' : 'Start Auction'}</span>
          </button>
        )}

        <button
          onClick={() => onControl('sold')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-sold hover:bg-amber-400 text-fjord-950 text-xs font-bold transition-all shadow-sm"
          title="Instant hammer gavel sold to highest bidder"
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>Hammer Sold</span>
        </button>

        <button
          onClick={() => onControl('unsold')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white text-xs font-bold border border-red-500/40 transition-all"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Mark Unsold</span>
        </button>

        <button
          onClick={() => onControl('next')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-panel hover:bg-teal-hover text-silver-soft text-xs font-bold border border-teal-border transition-all"
        >
          <FastForward className="w-3.5 h-3.5 text-mint-glacier" />
          <span>Next Player</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Trophy, Download, ShieldCheck, Heart, Sparkles, FileSpreadsheet } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass-panel border-t border-teal-border/40 mt-16 py-12 text-mist-grey text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-mint-glacier flex items-center justify-center text-fjord-950 font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg text-silver-soft tracking-wider">
                IPL AUCTION ARENA 2027
              </span>
            </div>
            <p className="text-mist-grey/80 leading-relaxed">
              Official-grade live multiplayer IPL simulation system. Experience realistic BCCI bidding engines, squad balance rules, and dynamic purse calculations.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-mint-glacier">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Glacier Mint Sports-Tech Edition</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-silver-soft uppercase tracking-wider mb-3">
              Official Downloads
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/api/exports/csv/mega" 
                  download 
                  className="flex items-center gap-2 hover:text-mint-glacier transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-mint-glacier" />
                  <span>IPL_2027_Mega_Auction_Players.csv</span>
                </a>
              </li>
              <li>
                <a 
                  href="/api/exports/csv/mini" 
                  download 
                  className="flex items-center gap-2 hover:text-mint-glacier transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-mint-ice" />
                  <span>IPL_2027_Mini_Auction_Players.csv</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-silver-soft uppercase tracking-wider mb-3">
              Auction Engine Rules
            </h4>
            <ul className="space-y-1.5 text-mist-grey/80">
              <li>• ₹120.00 Cr Default Team Purse</li>
              <li>• Squad Size: 18 - 25 Players</li>
              <li>• Maximum 8 Overseas Players</li>
              <li>• 10-Second Auto-Reset Countdown</li>
              <li>• BCCI-Graduated Bid Increments</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-silver-soft uppercase tracking-wider mb-3">
              Data Integrity & Disclaimer
            </h4>
            <div className="p-3 rounded-lg bg-teal-panel border border-teal-border text-[11px] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-mint-glacier mb-1" />
              <p>
                All data is derived from official BCCI IPL Auction Registries and projected 2027 parameters. Sample and estimated prices are explicitly tagged.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-teal-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px]">
            © 2027 IPL Auction Arena. Built for cricket enthusiasts, analysts, and fantasy leagues worldwide.
          </p>
          <p className="text-[11px] text-mist-grey/60 flex items-center gap-1">
            <span>Powered by FastAPI, React, WebSockets & Glacier Mint Theme</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

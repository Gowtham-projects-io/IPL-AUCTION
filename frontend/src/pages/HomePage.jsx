import React from 'react';
import { 
  Trophy, PlayCircle, PlusCircle, Users, Download, ShieldCheck, 
  Flame, Shield, ArrowRight, Sparkles, Database, CheckCircle2, FileSpreadsheet
} from 'lucide-react';

export const HomePage = ({ setActivePage, onLaunchDemo }) => {
  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 sm:p-14 glass-panel-elevated overflow-hidden border border-mint-glacier/30 text-center stadium-bg">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-mint-glacier/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint-glacier/15 border border-mint-glacier/30 text-mint-ice text-xs font-bold uppercase tracking-widest mb-6 mint-glow-sm">
          <Sparkles className="w-3.5 h-3.5 text-mint-glacier" />
          <span>Next-Generation IPL Simulation Engine</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-wide uppercase text-silver-soft leading-none mb-6">
          IPL AUCTION <span className="text-mint-glacier">ARENA 2027</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-mist-grey leading-relaxed mb-8">
          The ultimate sports-tech IPL auction broadcast experience. Create private bidding rooms, assemble your dream squad of superstars, outsmart rival franchise owners, and conquer the IPL 2027 season.
        </p>

        {/* Hero Quick Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('demo')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 font-display font-black text-base uppercase tracking-wider transition-all shadow-xl mint-glow active:scale-95"
          >
            <PlayCircle className="w-5 h-5 fill-current" />
            <span>Playable Demo Auction</span>
          </button>

          <button
            onClick={() => setActivePage('create-room')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-panel hover:bg-teal-hover text-silver-soft font-display font-bold text-base uppercase tracking-wider transition-all border border-teal-border hover:border-mint-glacier/40"
          >
            <PlusCircle className="w-5 h-5 text-mint-glacier" />
            <span>Create Auction Room</span>
          </button>

          <button
            onClick={() => setActivePage('join-room')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-fjord-950/80 hover:bg-fjord-950 text-silver-soft font-display font-bold text-base uppercase tracking-wider transition-all border border-teal-border hover:border-mint-glacier/40"
          >
            <Users className="w-5 h-5 text-mint-ice" />
            <span>Join With Code</span>
          </button>
        </div>

        {/* Quick Highlights Stat Bar */}
        <div className="mt-12 pt-8 border-t border-teal-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-mint-ice block">10</span>
            <span className="text-xs text-mist-grey uppercase tracking-wider">IPL Franchises</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-mint-glacier block">570+</span>
            <span className="text-xs text-mist-grey uppercase tracking-wider">Player Registry</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-mint-ice block">₹120 CR</span>
            <span className="text-xs text-mist-grey uppercase tracking-wider">Team Purse</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-gold-sold block">10 SEC</span>
            <span className="text-xs text-mist-grey uppercase tracking-wider">Hammer Timer</span>
          </div>
        </div>

      </section>

      {/* Dual Auction Modes: Mega Auction vs Mini Auction */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl text-silver-soft uppercase tracking-wide">
            CHOOSE YOUR AUCTION MODE
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey mt-1">
            Two distinct simulation systems engineered with real BCCI tournament regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mega Auction Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-teal-border/80 hover:border-mint-glacier/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-mint-glacier/15 border border-mint-glacier/30 text-mint-glacier text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>Mega Auction 2027</span>
                </span>
                <span className="text-xs text-mist-grey font-mono">₹120.00 Cr / Team</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-silver-soft uppercase mb-3">
                Full Squad Reset & Complete Pool
              </h3>

              <p className="text-xs sm:text-sm text-mist-grey leading-relaxed mb-6">
                All 10 IPL franchises start from ground zero with empty squads and a clean ₹120.00 Crore purse. Battle for marquee titans (Buttler, Pant, Starc, Iyer) through complete tiered sets.
              </p>

              <ul className="space-y-2 text-xs text-silver-soft mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-glacier shrink-0" />
                  <span>No retained players by default (fresh squads)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-glacier shrink-0" />
                  <span>Full 570+ player pool across M1, M2, BA, AL, WK, FA, SP</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-glacier shrink-0" />
                  <span>Squad limit: 18 - 25 players (max 8 overseas)</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('mega-setup')}
                className="flex-1 py-3 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-glacier border border-mint-glacier/30 font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Mega Mode Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini Auction Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-teal-border/80 hover:border-mint-glacier/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-300" />
                  <span>Mini Auction 2027</span>
                </span>
                <span className="text-xs text-mist-grey font-mono">Deducted Retentions</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-silver-soft uppercase mb-3">
                Pre-Retained Cores & Released Stars
              </h3>

              <p className="text-xs sm:text-sm text-mist-grey leading-relaxed mb-6">
                Franchises enter with their retained superstar cores (Kohli, Bumrah, Gaikwad, Klaasen, Samson). Team purses are automatically calculated after retention deductions.
              </p>

              <ul className="space-y-2 text-xs text-silver-soft mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-ice shrink-0" />
                  <span>Pre-allocated franchise retentions with realistic slabs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-ice shrink-0" />
                  <span>Automatically computed remaining team budgets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint-ice shrink-0" />
                  <span>Auction pool with released stars and fresh additions</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('mini-setup')}
                className="flex-1 py-3 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-ice border border-cyan-400/30 font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Mini Mode Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Official Downloadable CSV Banner */}
      <section className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-mint-glacier/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-mint-glacier text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Official CSV Downloads Available</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl text-silver-soft">
            EXPORT FULL PLAYER REGISTRY DATASETS
          </h3>
          <p className="text-xs text-mist-grey max-w-xl">
            Download the official player pools with base prices, auction sets, roles, and caps. You can also upload your own custom CSV in the Admin Dashboard!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/exports/csv/mega"
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-glacier border border-mint-glacier/40 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Mega CSV</span>
          </a>

          <a
            href="/api/exports/csv/mini"
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-ice border border-cyan-400/40 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Mini CSV</span>
          </a>
        </div>
      </section>

    </div>
  );
};


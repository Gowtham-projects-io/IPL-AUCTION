import React from 'react';
import { Flame, Download, CheckCircle2, ShieldAlert, ArrowRight, FileSpreadsheet, PlusCircle } from 'lucide-react';

export const MegaAuctionSetupPage = ({ setActivePage, onCreateWithMode }) => {
  const sets = [
    { set: "M1", name: "Marquee Set 1", players: "Jos Buttler, Shreyas Iyer, Rishabh Pant, Kagiso Rabada, Arshdeep Singh, Mitchell Starc", base: "₹2.00 Cr" },
    { set: "M2", name: "Marquee Set 2", players: "Yuzvendra Chahal, Liam Livingstone, David Miller, KL Rahul, Mohammad Shami, Mohammad Siraj", base: "₹1.50 - ₹2.00 Cr" },
    { set: "BA1", name: "Capped Batters 1", players: "Harry Brook, Devon Conway, Jake Fraser-McGurk, Aiden Markram, Devdutt Padikkal, David Warner", base: "₹0.75 - ₹2.00 Cr" },
    { set: "AL1", name: "Capped All-Rounders 1", players: "R Ashwin, Venkatesh Iyer, Mitchell Marsh, Glenn Maxwell, Harshal Patel, Rachin Ravindra", base: "₹1.50 - ₹2.00 Cr" },
    { set: "WK1", name: "Capped Wicketkeepers 1", players: "Jonny Bairstow, Quinton De Kock, Rahmanullah Gurbaz, Ishan Kishan, Phil Salt, Jitesh Sharma", base: "₹1.00 - ₹2.00 Cr" },
    { set: "FA1", name: "Capped Fast Bowlers 1", players: "Khaleel Ahmed, Trent Boult, Josh Hazlewood, Avesh Khan, Prasidh Krishna, T Natarajan, Anrich Nortje", base: "₹2.00 Cr" },
    { set: "SP1", name: "Capped Spinners 1", players: "Noor Ahmad, Rahul Chahar, Wanindu Hasaranga, Maheesh Theekshana, Adam Zampa", base: "₹1.00 - ₹2.00 Cr" },
    { set: "UBA1", name: "Uncapped Batters 1", players: "Yash Dhull, Abhinav Manohar, Karun Nair, Angkrish Raghuvanshi, Atharva Taide, Nehal Wadhera", base: "₹30 Lakh" },
    { set: "UAL1", name: "Uncapped All-Rounders 1", players: "Harpreet Brar, Naman Dhir, Mahipal Lomror, Sameer Rizvi, Abdul Samad, Ashutosh Sharma", base: "₹30 - ₹50 Lakh" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-mint-glacier/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-glacier/15 border border-mint-glacier/30 text-mint-glacier text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4" />
            <span>IPL 2027 Mega Auction Configuration</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-silver-soft uppercase tracking-wide">
            FRESH SQUADS & UNRESTRICTED BIDDING
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey max-w-xl mt-2">
            Mega Auction rules give all 10 franchises complete freedom to build their teams from scratch with an equal ₹120.00 Crore purse.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/api/exports/csv/mega"
            download
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-glacier border border-mint-glacier/40 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Mega CSV</span>
          </a>

          <button
            onClick={() => onCreateWithMode('mega')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 text-xs font-display font-black uppercase tracking-wider transition-all shadow-md mint-glow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Mega Room</span>
          </button>
        </div>
      </div>

      {/* Rules Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <h4 className="font-display font-bold text-lg text-silver-soft uppercase mb-2">Team Purse</h4>
          <span className="font-display font-black text-3xl text-mint-ice block mb-1">₹120.00 CR</span>
          <p className="text-xs text-mist-grey">
            Equal starting purse for all 10 franchises. Zero mandatory retentions deducted by default.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <h4 className="font-display font-bold text-lg text-silver-soft uppercase mb-2">Squad Composition</h4>
          <span className="font-display font-black text-3xl text-mint-glacier block mb-1">18 - 25</span>
          <p className="text-xs text-mist-grey">
            Minimum 18 players required to complete a legitimate squad. Maximum squad ceiling is 25.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <h4 className="font-display font-bold text-lg text-silver-soft uppercase mb-2">Overseas Cap</h4>
          <span className="font-display font-black text-3xl text-cyan-400 block mb-1">MAX 8</span>
          <p className="text-xs text-mist-grey">
            Strict maximum limit of 8 international/overseas players across the entire franchise roster.
          </p>
        </div>
      </div>

      {/* Set Progression Sequence */}
      <div className="glass-panel rounded-2xl p-6 border border-teal-border/60">
        <h3 className="font-display font-extrabold text-xl text-silver-soft uppercase mb-4">
          OFFICIAL AUCTION SET ORDER
        </h3>

        <div className="space-y-3">
          {sets.map((s, idx) => (
            <div
              key={s.set}
              className="p-3.5 rounded-xl bg-teal-panel/60 border border-teal-border/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-fjord-950 border border-mint-glacier/30 text-mint-ice font-mono font-black flex items-center justify-center shrink-0">
                  {s.set}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-silver-soft">{s.name}</h4>
                  <p className="text-[11px] text-mist-grey">{s.players}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-mist-grey uppercase block">Reserve Price Range</span>
                <span className="font-mono font-bold text-mint-glacier">{s.base}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


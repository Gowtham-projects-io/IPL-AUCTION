import React, { useState, useEffect } from 'react';
import { Shield, Download, ArrowRight, IndianRupee, Users, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

export const MiniAuctionSetupPage = ({ setActivePage, onCreateWithMode }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('CSK');
  const [retentions, setRetentions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const teamList = await api.getTeams();
        setTeams(teamList);
        if (teamList.length > 0) {
          const ret = await api.getTeamRetentions('CSK');
          setRetentions(ret);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectTeam = async (tId) => {
    setSelectedTeam(tId);
    try {
      const ret = await api.getTeamRetentions(tId);
      setRetentions(ret);
    } catch (e) {
      console.error(e);
    }
  };

  const totalDeducted = retentions.reduce((sum, r) => sum + r.retention_cost_cr, 0);
  const remainingPurse = Math.max(0, 120.0 - totalDeducted);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-cyan-400/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-4 h-4 text-cyan-300" />
            <span>IPL 2027 Mini Auction Configuration</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-silver-soft uppercase tracking-wide">
            FRANCHISE RETENTIONS & PURSE DEDUCTIONS
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey max-w-xl mt-2">
            Franchises retain their core superstars before heading into the mini auction. Remaining budgets and open squad slots are automatically synchronized.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/api/exports/csv/mini"
            download
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover text-mint-ice border border-cyan-400/40 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Mini CSV</span>
          </a>

          <button
            onClick={() => onCreateWithMode('mini')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 text-xs font-display font-black uppercase tracking-wider transition-all shadow-md mint-glow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Mini Room</span>
          </button>
        </div>
      </div>

      {/* Franchise Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelectTeam(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 flex items-center gap-2 ${
              selectedTeam === t.id
                ? 'bg-mint-glacier text-fjord-950 shadow-md mint-glow-sm font-black'
                : 'bg-teal-panel/70 text-silver-soft border border-teal-border/40 hover:bg-teal-panel'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: t.primary_color || '#76DCC5' }}
            />
            <span>{t.id}</span>
          </button>
        ))}
      </div>

      {/* Selected Team Retention Overview */}
      <div className="glass-panel rounded-2xl p-6 border border-teal-border/60">
        <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-teal-border/40 mb-6 gap-4">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-silver-soft uppercase">
              {teams.find(t => t.id === selectedTeam)?.name} ({selectedTeam})
            </h3>
            <p className="text-xs text-mist-grey">
              Official Retained Roster ({retentions.length} Players Pre-Allocated)
            </p>
          </div>

          <div className="flex items-center gap-6 text-center sm:text-right">
            <div>
              <span className="text-[10px] text-mist-grey uppercase block">Retentions Cost</span>
              <span className="font-display font-black text-xl text-red-400">
                -₹{totalDeducted.toFixed(2)} Cr
              </span>
            </div>

            <div className="pl-6 border-l border-teal-border/40">
              <span className="text-[10px] text-mist-grey uppercase block">Starting Mini Purse</span>
              <span className="font-display font-black text-2xl text-mint-ice">
                ₹{remainingPurse.toFixed(2)} Cr
              </span>
            </div>
          </div>
        </div>

        {/* Retained Players Table */}
        <div className="space-y-2.5">
          {retentions.length === 0 ? (
            <div className="py-8 text-center text-xs text-mist-grey italic">
              Loading franchise retention details...
            </div>
          ) : (
            retentions.map((r, idx) => (
              <div
                key={r.id || idx}
                className="p-3 rounded-xl bg-teal-panel/60 border border-teal-border/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-fjord-950 text-mint-glacier font-mono font-bold text-[11px] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-silver-soft text-sm">{r.player_name}</h4>
                    <span className="text-[11px] text-mist-grey">
                      {r.role} • {r.country} {r.is_uncapped && "• (Uncapped Rule)"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-sm text-silver-soft block leading-none">
                    ₹{r.retention_cost_cr} Cr
                  </span>
                  <span className="text-[10px] text-mist-grey font-mono">{r.retention_slab}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};


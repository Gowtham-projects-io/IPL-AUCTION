import React, { useState, useEffect } from 'react';
import { Shield, Users, Globe, IndianRupee, PieChart, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const TeamSquadPage = ({ currentRoomId }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('CSK');
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const tList = await api.getTeams();
        setTeams(tList);
      } catch (e) {
        console.error(e);
      }
    };
    loadTeams();
  }, []);

  useEffect(() => {
    const loadSquad = async () => {
      setLoading(true);
      try {
        if (currentRoomId) {
          const data = await api.getTeamSquadInRoom(selectedTeam, currentRoomId);
          setSquad(data);
        } else {
          // If no active room, show default retentions for team
          const ret = await api.getTeamRetentions(selectedTeam);
          const mockSquad = ret.map(r => ({
            id: r.id,
            player_name: r.player_name,
            role: r.role,
            country: r.country,
            is_overseas: r.country.toLowerCase() !== 'india',
            price_cr: r.retention_cost_cr,
            price_lakh: Math.round(r.retention_cost_cr * 100),
            is_retained: true
          }));
          setSquad(mockSquad);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadSquad();
  }, [selectedTeam, currentRoomId]);

  const activeTeamObj = teams.find(t => t.id === selectedTeam) || {
    name: 'Chennai Super Kings',
    id: 'CSK',
    primary_color: '#F9CD05',
    default_purse_cr: 120.0
  };

  const totalSpent = squad.reduce((sum, s) => sum + (s.price_cr || 0), 0);
  const remainingPurse = Math.max(0, (activeTeamObj.default_purse_cr || 120.0) - totalSpent);
  const overseasCount = squad.filter(s => s.is_overseas).length;

  const roleCounts = {
    Batter: squad.filter(s => s.role === 'Batter').length,
    Bowler: squad.filter(s => s.role === 'Bowler').length,
    'All-rounder': squad.filter(s => s.role === 'All-rounder').length,
    Wicketkeeper: squad.filter(s => s.role === 'Wicketkeeper').length
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & Team Tabs */}
      <div>
        <h2 className="font-display font-black text-3xl text-silver-soft uppercase tracking-wide mb-2">
          TEAM SQUAD & SQUAD BALANCE DASHBOARD
        </h2>
        <p className="text-xs sm:text-sm text-mist-grey mb-6">
          Inspect squad composition, role distribution, overseas ratios, and budget allocations for all 10 franchises.
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTeam(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 flex items-center gap-2 ${
                selectedTeam === t.id
                  ? 'bg-mint-glacier text-fjord-950 font-black shadow-md mint-glow-sm'
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
      </div>

      {/* Team Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <span className="text-[10px] text-mist-grey uppercase block mb-1">Remaining Purse</span>
          <span className="font-display font-black text-3xl text-mint-ice block leading-none">
            ₹{remainingPurse.toFixed(2)} Cr
          </span>
          <span className="text-[11px] text-mist-grey mt-1 block">
            Spent: ₹{totalSpent.toFixed(2)} Cr
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <span className="text-[10px] text-mist-grey uppercase block mb-1">Squad Size</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-silver-soft leading-none">
              {squad.length}
            </span>
            <span className="text-xs text-mist-grey font-mono">/ 25 Players</span>
          </div>
          <span className={`text-[11px] mt-1 block font-semibold ${
            squad.length >= 18 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {squad.length >= 18 ? '✓ Min 18 Reached' : `Needs ${18 - squad.length} more to meet min 18`}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <span className="text-[10px] text-mist-grey uppercase block mb-1">Overseas Limit</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-cyan-300 leading-none">
              {overseasCount}
            </span>
            <span className="text-xs text-mist-grey font-mono">/ 8 Max</span>
          </div>
          <span className="text-[11px] text-mist-grey mt-1 block">
            {8 - overseasCount} Overseas Slots Left
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-teal-border/60">
          <span className="text-[10px] text-mist-grey uppercase block mb-1">Squad Balance Rating</span>
          <span className="font-display font-black text-2xl text-mint-glacier block leading-none">
            {squad.length >= 15 ? 'OPTIMIZED' : 'IN REBUILD'}
          </span>
          <span className="text-[11px] text-mist-grey mt-1 block">
            Pace & Spin Depth Monitored
          </span>
        </div>

      </div>

      {/* Role Distribution Bars */}
      <div className="glass-panel rounded-2xl p-6 border border-teal-border/60">
        <h3 className="font-display font-bold text-lg text-silver-soft uppercase mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-mint-glacier" />
          <span>Role Balance Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-teal-panel/60 border border-teal-border/40">
            <span className="text-xs text-mist-grey block mb-1">BATTERS</span>
            <span className="font-display font-extrabold text-2xl text-silver-soft">
              {roleCounts.Batter}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-teal-panel/60 border border-teal-border/40">
            <span className="text-xs text-mist-grey block mb-1">BOWLERS</span>
            <span className="font-display font-extrabold text-2xl text-silver-soft">
              {roleCounts.Bowler}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-teal-panel/60 border border-teal-border/40">
            <span className="text-xs text-mist-grey block mb-1">ALL-ROUNDERS</span>
            <span className="font-display font-extrabold text-2xl text-silver-soft">
              {roleCounts['All-rounder']}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-teal-panel/60 border border-teal-border/40">
            <span className="text-xs text-mist-grey block mb-1">WICKETKEEPERS</span>
            <span className="font-display font-extrabold text-2xl text-silver-soft">
              {roleCounts.Wicketkeeper}
            </span>
          </div>
        </div>
      </div>

      {/* Squad Roster Table */}
      <div className="glass-panel rounded-2xl p-6 border border-teal-border/60">
        <div className="flex items-center justify-between pb-3 border-b border-teal-border/40 mb-4">
          <h3 className="font-display font-bold text-lg text-silver-soft uppercase">
            {activeTeamObj.name} Current Squad ({squad.length})
          </h3>
          <span className="text-xs text-mist-grey font-mono">
            Acquisition History
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-mist-grey">Loading squad...</div>
        ) : squad.length === 0 ? (
          <div className="py-12 text-center text-xs text-mist-grey italic">
            No players currently in this team squad. Start bidding in an auction room to acquire players!
          </div>
        ) : (
          <div className="space-y-2">
            {squad.map((player, idx) => (
              <div
                key={player.id || idx}
                className="p-3 rounded-xl bg-teal-panel/60 border border-teal-border/40 flex items-center justify-between text-xs hover:border-mint-glacier/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-fjord-950 text-mint-ice font-mono font-bold text-[11px] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-silver-soft text-sm">{player.player_name}</h4>
                    <span className="text-[11px] text-mist-grey flex items-center gap-2">
                      <span>{player.role}</span>
                      <span>•</span>
                      <span>{player.country}</span>
                      {player.is_overseas && (
                        <span className="text-cyan-400 font-semibold">• Overseas</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-sm text-mint-glacier block leading-none">
                    ₹{player.price_cr} Cr
                  </span>
                  <span className="text-[10px] text-mist-grey">
                    {player.is_retained ? 'Retained Core' : 'Auction Buy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};


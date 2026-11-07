import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Globe, Shield, Sparkles, Download } from 'lucide-react';
import { api } from '../services/api';

export const PlayerDatabasePage = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('');
  const [auctionSet, setAuctionSet] = useState('');
  const [isOverseas, setIsOverseas] = useState('');
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await api.getPlayerSets('mega');
        setSets(res.sets || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSets();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (role) params.role = role;
        if (category) params.category = category;
        if (auctionSet) params.auction_set = auctionSet;
        if (isOverseas !== '') params.is_overseas = isOverseas === 'true';

        const data = await api.getPlayers(params);
        setPlayers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(debounce);
  }, [search, role, category, auctionSet, isOverseas]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-teal-border/50">
        <div>
          <h2 className="font-display font-black text-3xl text-silver-soft uppercase tracking-wide">
            IPL 2027 PLAYER REGISTRY
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey">
            Official database of all registered players, base reserve prices, sets, and international caps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/exports/csv/mega"
            download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-mint-glacier text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Mega CSV</span>
          </a>

          <a
            href="/api/exports/csv/mini"
            download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-mint-ice text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Mini CSV</span>
          </a>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-teal-border/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-mist-grey absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player or past team..."
              className="w-full bg-fjord-950 text-silver-soft text-xs rounded-xl pl-9 pr-3 py-2.5 border border-teal-border focus:border-mint-glacier outline-none"
            />
          </div>

          {/* Role Filter */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2.5 border border-teal-border focus:border-mint-glacier outline-none"
          >
            <option value="">All Roles</option>
            <option value="Batter">Batter</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicketkeeper">Wicketkeeper</option>
          </select>

          {/* Set Filter */}
          <select
            value={auctionSet}
            onChange={(e) => setAuctionSet(e.target.value)}
            className="bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2.5 border border-teal-border focus:border-mint-glacier outline-none"
          >
            <option value="">All Auction Sets</option>
            {sets.map((s) => (
              <option key={s} value={s}>Set {s}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2.5 border border-teal-border focus:border-mint-glacier outline-none"
          >
            <option value="">All Categories</option>
            <option value="Marquee">Marquee Players</option>
            <option value="Capped Indian">Capped Indian</option>
            <option value="Capped overseas">Capped Overseas</option>
            <option value="Uncapped Indian">Uncapped Indian</option>
            <option value="Uncapped overseas">Uncapped Overseas</option>
          </select>

          {/* Overseas Filter */}
          <select
            value={isOverseas}
            onChange={(e) => setIsOverseas(e.target.value)}
            className="bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2.5 border border-teal-border focus:border-mint-glacier outline-none"
          >
            <option value="">All Nationalities</option>
            <option value="false">Indian Players 🇮🇳</option>
            <option value="true">Overseas Players 🌐</option>
          </select>

        </div>
      </div>

      {/* Players Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-mist-grey">Querying player registry...</div>
      ) : players.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-teal-border/40">
          <Database className="w-12 h-12 text-mist-grey mx-auto mb-3 opacity-60" />
          <h3 className="font-display font-bold text-xl text-silver-soft mb-1">No Players Found</h3>
          <p className="text-xs text-mist-grey">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-2xl p-4 border border-teal-border/60 hover:border-mint-glacier/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-fjord-950 text-mint-ice border border-teal-border">
                      {p.auction_set}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-panel text-mint-glacier font-semibold border border-teal-border">
                      {p.role}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-mist-grey">
                    {p.id}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-teal-panel border border-teal-border p-1 overflow-hidden shrink-0">
                    <img 
                      src={p.player_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.name.replace(' ', '')}`} 
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-silver-soft leading-tight uppercase">
                      {p.name}
                    </h3>
                    <p className="text-xs text-mist-grey mt-0.5">
                      {p.country} {p.state_association && `• ${p.state_association}`} • Age: {p.age}
                    </p>
                    <span className="text-[10px] text-mint-ice/80 block mt-0.5 truncate max-w-[180px]">
                      {p.auction_category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-fjord-950/60 p-2 rounded-lg border border-teal-border/30 mb-3">
                  <div>
                    <span className="text-mist-grey uppercase block">IPL Caps</span>
                    <span className="font-bold text-silver-soft">{p.ipl_matches || 0}</span>
                  </div>
                  <div>
                    <span className="text-mist-grey uppercase block">T20 Caps</span>
                    <span className="font-bold text-silver-soft">{p.t20_caps || 0}</span>
                  </div>
                  <div>
                    <span className="text-mist-grey uppercase block">Bat/Bowl</span>
                    <span className="font-bold text-silver-soft truncate block" title={`${p.batting_style} / ${p.bowling_style}`}>
                      {p.batting_style}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-teal-border/30 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-mist-grey uppercase block">Reserve Price</span>
                  <span className="font-display font-black text-sm text-mint-glacier leading-none">
                    ₹{p.base_price_lakh} Lakh <span className="text-[10px] text-mist-grey font-sans font-normal">(₹{p.base_price_cr} Cr)</span>
                  </span>
                </div>

                <span className="text-[9px] text-mist-grey bg-teal-panel px-2 py-0.5 rounded border border-teal-border">
                  {p.data_status.includes("Confirmed") ? "✓ Confirmed Data" : "Custom/Projected"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};


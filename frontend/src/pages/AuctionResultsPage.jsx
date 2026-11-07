import React, { useState, useEffect } from 'react';
import { Trophy, Download, Printer, Shield, ArrowRight, Award, FileSpreadsheet, Users } from 'lucide-react';
import { api } from '../services/api';

export const AuctionResultsPage = ({ currentRoomId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (currentRoomId) {
          const data = await api.getAuctionResults(currentRoomId);
          setResults(data);
        } else {
          // If no current room, load public rooms and pick first or mock results
          const publicRooms = await api.getPublicRooms();
          if (publicRooms.length > 0) {
            const data = await api.getAuctionResults(publicRooms[0].id);
            setResults(data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [currentRoomId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-gold-sold/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 gold-glow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-sold/20 border border-gold-sold/40 text-gold-sold text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4" />
            <span>IPL 2027 Season Tournament Ledger</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-silver-soft uppercase tracking-wide">
            OFFICIAL AUCTION RESULTS & SQUADS
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey max-w-xl mt-2">
            Final squad allocations, financial outlays, most expensive superstar buys, and role balances across all 10 IPL franchises.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentRoomId && (
            <a
              href={`/api/exports/results/${currentRoomId}/download-csv`}
              download
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-sold hover:bg-amber-400 text-fjord-950 text-xs font-bold transition-all shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Results CSV</span>
            </a>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-silver-soft text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4 text-mint-glacier" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-mist-grey">
          Calculating final tournament statistics...
        </div>
      ) : !results ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-teal-border/40">
          <Trophy className="w-12 h-12 text-mist-grey mx-auto mb-3 opacity-60" />
          <h3 className="font-display font-bold text-xl text-silver-soft mb-1">No Completed Auction Data</h3>
          <p className="text-xs text-mist-grey">Join or run an auction session to generate post-auction leaderboards.</p>
        </div>
      ) : (
        <>
          {/* Top Superlatives Card */}
          {results.most_expensive_player && (
            <div className="glass-card rounded-2xl p-6 border border-gold-sold/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-sold/20 border border-gold-sold/40 flex items-center justify-center text-gold-sold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-sold font-bold block">
                    MOST EXPENSIVE ACQUISITION OF THE SEASON
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-silver-soft">
                    {results.most_expensive_player.name}
                  </h3>
                  <span className="text-xs text-mist-grey">
                    Acquired by <strong className="text-silver-soft">{results.most_expensive_player.team_id}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display font-black text-3xl sm:text-4xl text-gold-sold block leading-none">
                  ₹{results.most_expensive_player.price_cr} CR
                </span>
                <span className="text-xs text-mist-grey font-mono">
                  (₹{results.most_expensive_player.price_lakh} Lakh)
                </span>
              </div>
            </div>
          )}

          {/* Franchise Summary Leaderboard Table */}
          <div className="glass-panel rounded-2xl p-6 border border-teal-border/60">
            <h3 className="font-display font-bold text-lg text-silver-soft uppercase mb-4">
              FRANCHISE EXPENDITURE & BALANCE SUMMARY
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-teal-border/40 text-mist-grey uppercase font-mono">
                    <th className="pb-3">Franchise</th>
                    <th className="pb-3 text-right">Total Budget</th>
                    <th className="pb-3 text-right">Amount Spent</th>
                    <th className="pb-3 text-right">Remaining Purse</th>
                    <th className="pb-3 text-center">Squad Count</th>
                    <th className="pb-3 text-center">Overseas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-border/20">
                  {Object.entries(results.teams || {}).map(([tId, t]) => (
                    <tr key={tId} className="hover:bg-teal-panel/40 transition-colors">
                      <td className="py-3 font-bold text-silver-soft flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-black"
                          style={{ backgroundColor: t.primary_color || '#102D32' }}
                        >
                          {tId}
                        </span>
                        <span>{t.team_name}</span>
                      </td>
                      <td className="py-3 text-right font-mono text-silver-soft">
                        ₹{t.total_purse_cr} Cr
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-gold-sold">
                        ₹{t.spent_purse_cr.toFixed(2)} Cr
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-mint-glacier">
                        ₹{t.remaining_purse_cr.toFixed(2)} Cr
                      </td>
                      <td className="py-3 text-center font-bold text-silver-soft">
                        {t.squad_count} / 25
                      </td>
                      <td className="py-3 text-center font-bold text-cyan-400">
                        {t.overseas_count} / 8
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};


import React, { useState } from 'react';
import { PlusCircle, Flame, Shield, Clock, IndianRupee, Globe, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const CreateRoomPage = ({ onRoomCreated, setActivePage }) => {
  const [name, setName] = useState('IPL 2027 Mega Arena');
  const [auctionMode, setAuctionMode] = useState('mega'); // 'mega' or 'mini'
  const [purseCr, setPurseCr] = useState(120.0);
  const [countdownSec, setCountdownSec] = useState(10);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a room name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const room = await api.createRoom({
        name: name.trim(),
        auction_mode: auctionMode,
        purse_cr: parseFloat(purseCr),
        countdown_sec: parseInt(countdownSec),
        is_public: isPublic
      });
      onRoomCreated(room);
    } catch (err) {
      setError(err.message || 'Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-teal-border/80 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-mint-glacier/20 border border-mint-glacier/40 flex items-center justify-center text-mint-glacier mx-auto mb-3 mint-glow-sm">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-silver-soft uppercase tracking-wide">
            CREATE AUCTION ROOM
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey mt-1">
            Configure your IPL 2027 multiplayer room and invite up to 10 franchise owners.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold text-silver-soft uppercase tracking-wider mb-2">
              Auction Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dream 11 Premier League 2027"
              className="w-full bg-fjord-950 border border-teal-border rounded-xl px-4 py-3 text-sm text-silver-soft focus:border-mint-glacier outline-none transition-colors"
              required
            />
          </div>

          {/* Auction Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-silver-soft uppercase tracking-wider mb-2">
              Select Auction Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAuctionMode('mega')}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  auctionMode === 'mega'
                    ? 'bg-mint-glacier/15 border-mint-glacier shadow-sm mint-glow-sm'
                    : 'bg-teal-panel/60 border-teal-border/40 hover:bg-teal-panel'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Flame className={`w-5 h-5 ${auctionMode === 'mega' ? 'text-mint-glacier' : 'text-mist-grey'}`} />
                  <span className="text-[10px] font-mono font-bold text-mint-ice">Fresh Squads</span>
                </div>
                <h4 className="font-display font-bold text-base text-silver-soft uppercase">
                  Mega Auction 2027
                </h4>
                <p className="text-[11px] text-mist-grey mt-1">
                  Full 570+ player pool, ₹120 Cr budget, clean slate for all franchises.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAuctionMode('mini')}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  auctionMode === 'mini'
                    ? 'bg-cyan-900/30 border-cyan-400 shadow-sm'
                    : 'bg-teal-panel/60 border-teal-border/40 hover:bg-teal-panel'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Shield className={`w-5 h-5 ${auctionMode === 'mini' ? 'text-cyan-400' : 'text-mist-grey'}`} />
                  <span className="text-[10px] font-mono font-bold text-cyan-200">With Retentions</span>
                </div>
                <h4 className="font-display font-bold text-base text-silver-soft uppercase">
                  Mini Auction 2027
                </h4>
                <p className="text-[11px] text-mist-grey mt-1">
                  Retained core stars included, auto-deducted team budgets & released pool.
                </p>
              </button>
            </div>
          </div>

          {/* Purse & Timer sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-teal-panel/60 border border-teal-border/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-silver-soft uppercase flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-mint-glacier" />
                  <span>Team Purse</span>
                </span>
                <span className="font-display font-extrabold text-mint-ice text-sm">
                  ₹{purseCr} Cr
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="150"
                step="5"
                value={purseCr}
                onChange={(e) => setPurseCr(e.target.value)}
                className="w-full accent-mint-glacier cursor-pointer"
              />
              <span className="text-[10px] text-mist-grey mt-1 block">BCCI default: ₹120.00 Cr</span>
            </div>

            <div className="p-4 rounded-xl bg-teal-panel/60 border border-teal-border/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-silver-soft uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-mint-glacier" />
                  <span>Countdown Timer</span>
                </span>
                <span className="font-display font-extrabold text-mint-ice text-sm">
                  {countdownSec} Seconds
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={countdownSec}
                onChange={(e) => setCountdownSec(e.target.value)}
                className="w-full accent-mint-glacier cursor-pointer"
              />
              <span className="text-[10px] text-mist-grey mt-1 block">Resets on every valid bid</span>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="p-4 rounded-xl bg-teal-panel/40 border border-teal-border/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-mint-glacier" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400" />
              )}
              <div>
                <span className="text-xs font-bold text-silver-soft block">
                  {isPublic ? 'Public Auction Room' : 'Private Auction Room'}
                </span>
                <span className="text-[11px] text-mist-grey">
                  {isPublic ? 'Visible in public rooms lobby' : 'Requires room code or invite link to join'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                isPublic ? 'bg-mint-glacier' : 'bg-fjord-950'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-fjord-950 transition-transform ${
                  isPublic ? 'translate-x-6 bg-fjord-950' : 'translate-x-0 bg-mist-grey'
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 font-display font-black text-lg uppercase tracking-wider transition-all shadow-xl mint-glow flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Arena...' : 'Create & Launch Room'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </form>

      </div>
    </div>
  );
};

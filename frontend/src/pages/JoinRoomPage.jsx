import React, { useState } from 'react';
import { LogIn, Key, ArrowRight, AlertCircle, Users } from 'lucide-react';
import { api } from '../services/api';

export const JoinRoomPage = ({ onRoomJoined, setActivePage }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a 4-8 character room code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const room = await api.getRoomByCode(code.trim().toUpperCase());
      onRoomJoined(room);
    } catch (err) {
      setError(err.message || 'Room not found. Check code and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-teal-border/80 shadow-2xl text-center">
        
        <div className="w-12 h-12 rounded-2xl bg-mint-glacier/20 border border-mint-glacier/40 flex items-center justify-center text-mint-glacier mx-auto mb-4 mint-glow-sm">
          <Key className="w-6 h-6" />
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-silver-soft uppercase tracking-wide">
          JOIN AUCTION ROOM
        </h2>

        <p className="text-xs text-mist-grey mt-1 mb-6">
          Enter the unique invitation room code shared by your league host.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-xs text-red-200 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. IPL27-X8K1"
              className="w-full text-center bg-fjord-950 border border-teal-border rounded-xl px-4 py-3 text-lg font-mono font-bold tracking-widest text-mint-ice focus:border-mint-glacier outline-none uppercase"
              maxLength={12}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 font-display font-black text-base uppercase tracking-wider transition-all shadow-lg mint-glow flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Entering Arena...' : 'Join Auction Arena'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-teal-border/40">
          <button
            onClick={() => setActivePage('public-rooms')}
            className="text-xs text-mint-glacier hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Browse Active Public Rooms</span>
          </button>
        </div>

      </div>
    </div>
  );
};


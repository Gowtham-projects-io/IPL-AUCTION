import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, ArrowRight, Shield, Flame, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const PublicRoomsPage = ({ onRoomSelect, setActivePage }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await api.getPublicRooms();
      setRooms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-teal-border/50">
        <div>
          <h2 className="font-display font-black text-3xl text-silver-soft uppercase tracking-wide">
            LIVE PUBLIC AUCTIONS
          </h2>
          <p className="text-xs sm:text-sm text-mist-grey">
            Join ongoing public rooms or create your own custom IPL arena.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRooms}
            className="p-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-mist-grey hover:text-mint-glacier transition-colors"
            title="Refresh room list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setActivePage('create-room')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-mint-glacier hover:bg-mint-hover text-fjord-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md mint-glow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Room</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-mist-grey">
          Scanning live broadcast lobbies...
        </div>
      ) : rooms.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-teal-border/40">
          <Users className="w-12 h-12 text-mist-grey mx-auto mb-3 opacity-60" />
          <h3 className="font-display font-bold text-xl text-silver-soft mb-1">No Active Public Rooms</h3>
          <p className="text-xs text-mist-grey mb-6">Be the first to host an IPL 2027 auction session!</p>
          <button
            onClick={() => setActivePage('create-room')}
            className="px-5 py-2.5 rounded-xl bg-mint-glacier text-fjord-950 font-bold text-xs"
          >
            Launch First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="glass-card rounded-2xl p-5 border border-teal-border/60 hover:border-mint-glacier/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-fjord-950 text-mint-ice border border-teal-border">
                    {room.room_code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {room.auction_mode === 'mega' ? (
                      <span className="px-2 py-0.5 rounded bg-mint-glacier/15 text-mint-glacier text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Mega
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Mini
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      room.status === 'active' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-teal-panel text-mist-grey'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-extrabold text-xl text-silver-soft uppercase mb-1">
                  {room.name}
                </h3>

                <p className="text-xs text-mist-grey mb-4">
                  Purse: ₹{room.purse_cr} Cr • Countdown: {room.countdown_sec}s
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-teal-border/30">
                <span className="text-xs text-mist-grey flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-mint-glacier" />
                  <span>{room.participants_count || 0} / 10 Franchises</span>
                </span>

                <button
                  onClick={() => onRoomSelect(room)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-panel hover:bg-mint-glacier text-silver-soft hover:text-fjord-950 text-xs font-bold transition-all border border-teal-border hover:border-mint-glacier"
                >
                  <span>Enter Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

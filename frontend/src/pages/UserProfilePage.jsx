import React from 'react';
import { User, Shield, LogOut, Award, CheckCircle2, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserProfilePage = ({ setActivePage }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-panel-elevated rounded-3xl p-8 border border-teal-border">
          <User className="w-12 h-12 text-mint-glacier mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-silver-soft mb-2">Guest Profile</h3>
          <p className="text-xs text-mist-grey mb-6">You are currently participating as a guest user.</p>
          <button
            onClick={() => setActivePage('home')}
            className="px-5 py-2.5 rounded-xl bg-mint-glacier text-fjord-950 font-bold text-xs"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-teal-border/80 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-teal-border/40 text-center sm:text-left">
          <div className="w-24 h-24 rounded-2xl bg-teal-panel border-2 border-mint-glacier/40 p-1 overflow-hidden shrink-0 shadow-lg mint-glow-sm">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
              alt={user.username}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display font-black text-3xl text-silver-soft uppercase">
                {user.username}
              </h2>
              {user.is_admin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint-glacier/20 text-mint-ice border border-mint-glacier/40 uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-mist-grey">{user.email}</p>
            <span className="text-[11px] text-mint-glacier font-medium block">
              Official Franchise Bidder ID: #IPL27-{user.id || '001'}
            </span>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 text-center">
          <div className="p-3.5 rounded-xl bg-teal-panel/60 border border-teal-border/40">
            <span className="text-[10px] text-mist-grey uppercase block mb-1">Simulations Run</span>
            <span className="font-display font-black text-2xl text-mint-ice">12</span>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-panel/60 border border-teal-border/40">
            <span className="text-[10px] text-mist-grey uppercase block mb-1">Superstars Bought</span>
            <span className="font-display font-black text-2xl text-silver-soft">38</span>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-panel/60 border border-teal-border/40 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-mist-grey uppercase block mb-1">Squad Rating</span>
            <span className="font-display font-black text-2xl text-gold-sold">94%</span>
          </div>
        </div>

        <div className="pt-4 border-t border-teal-border/40 flex items-center justify-between">
          <button
            onClick={() => setActivePage('admin')}
            className="px-4 py-2 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-silver-soft text-xs font-bold transition-all"
          >
            Admin Panel
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};


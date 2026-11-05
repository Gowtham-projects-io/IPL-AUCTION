import React, { useState } from 'react';
import { 
  Trophy, Shield, Users, Database, PlayCircle, PlusCircle, 
  LogIn, LogOut, Settings, Menu, X, Download, Flame, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout, guestLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Trophy },
    { id: 'demo', label: 'Playable Demo', icon: PlayCircle, highlight: true },
    { id: 'public-rooms', label: 'Auction Rooms', icon: Users },
    { id: 'mega-setup', label: 'Mega 2027', icon: Flame },
    { id: 'mini-setup', label: 'Mini 2027', icon: Shield },
    { id: 'database', label: 'Player Database', icon: Database },
    { id: 'squads', label: 'Team Squads', icon: Shield },
    { id: 'results', label: 'Results', icon: Trophy },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-teal-border/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Season Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint-glacier to-teal-panel flex items-center justify-center p-2 shadow-lg mint-glow-sm">
              <Trophy className="w-6 h-6 text-fjord-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-wider text-silver-soft">
                  IPL <span className="text-mint-glacier">ARENA</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-mint-glacier/20 text-mint-ice border border-mint-glacier/30 uppercase tracking-widest font-mono">
                  2027
                </span>
              </div>
              <p className="text-[10px] text-mist-grey font-medium tracking-tight">Broadcast Auction Simulator</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    item.highlight
                      ? 'bg-mint-glacier/15 text-mint-glacier border border-mint-glacier/30 hover:bg-mint-glacier/25 mint-glow-sm'
                      : isActive
                      ? 'bg-teal-hover text-mint-glacier border border-mint-glacier/30'
                      : 'text-silver-soft/80 hover:text-mint-glacier hover:bg-teal-hover/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-mint-glacier animate-pulse' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('create-room')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-glacier text-fjord-950 text-xs font-bold tracking-wide hover:bg-mint-hover transition-all shadow-md mint-glow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Room</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="p-2 rounded-lg bg-teal-panel hover:bg-teal-hover text-mist-grey hover:text-mint-glacier border border-teal-border/40 transition-colors"
              title="Admin Dashboard"
            >
              <Settings className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-teal-border/50">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 text-xs text-silver-soft hover:text-mint-glacier font-medium"
                >
                  <img src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} alt={user.username} className="w-7 h-7 rounded-full border border-mint-glacier/40" />
                  <span className="max-w-[80px] truncate">{user.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-mist-grey hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={guestLogin}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-panel text-xs text-silver-soft hover:text-mint-glacier border border-teal-border hover:border-mint-glacier/40 transition-all font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Guest Demo</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('demo')}
              className="px-2.5 py-1 text-xs font-bold rounded bg-mint-glacier text-fjord-950"
            >
              Play Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-teal-panel text-silver-soft"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-elevated border-b border-teal-border px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-hover text-mint-glacier border border-mint-glacier/30'
                    : 'text-silver-soft hover:bg-teal-hover/50'
                }`}
              >
                <Icon className="w-4 h-4 text-mint-glacier" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-teal-border/50 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('create-room')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-mint-glacier text-fjord-950 font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Auction Room</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-panel text-silver-soft text-sm font-medium border border-teal-border"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

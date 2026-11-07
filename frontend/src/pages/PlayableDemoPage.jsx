import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayCircle, RefreshCw, Gavel, Shield, Sparkles, Clock, Globe, 
  RotateCcw, CheckCircle, Volume2, VolumeX, AlertCircle, ArrowRight
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';
import confetti from 'canvas-confetti';

const SAMPLE_DEMO_PLAYERS = [
  {
    id: "DEMO-001",
    name: "Rishabh Pant",
    role: "Wicketkeeper",
    country: "India",
    is_overseas: false,
    age: 27,
    batting_style: "LHB",
    bowling_style: "None",
    base_price_lakh: 200,
    base_price_cr: 2.0,
    auction_set: "M1",
    auction_category: "Marquee players",
    ipl_matches: 111,
    player_image: "https://api.dicebear.com/7.x/bottts/svg?seed=RishabhPant"
  },
  {
    id: "DEMO-002",
    name: "Mitchell Starc",
    role: "Bowler",
    country: "Australia",
    is_overseas: true,
    age: 35,
    batting_style: "LHB",
    bowling_style: "LEFT ARM Fast",
    base_price_lakh: 200,
    base_price_cr: 2.0,
    auction_set: "M1",
    auction_category: "Marquee players",
    ipl_matches: 41,
    player_image: "https://api.dicebear.com/7.x/bottts/svg?seed=MitchellStarc"
  },
  {
    id: "DEMO-003",
    name: "Shreyas Iyer",
    role: "Batter",
    country: "India",
    is_overseas: false,
    age: 30,
    batting_style: "RHB",
    bowling_style: "RIGHT ARM Off Spin",
    base_price_lakh: 200,
    base_price_cr: 2.0,
    auction_set: "M1",
    auction_category: "Marquee players",
    ipl_matches: 116,
    player_image: "https://api.dicebear.com/7.x/bottts/svg?seed=ShreyasIyer"
  },
  {
    id: "DEMO-004",
    name: "Jos Buttler",
    role: "Wicketkeeper",
    country: "England",
    is_overseas: true,
    age: 34,
    batting_style: "RHB",
    bowling_style: "RIGHT ARM Off Spin",
    base_price_lakh: 200,
    base_price_cr: 2.0,
    auction_set: "M1",
    auction_category: "Marquee players",
    ipl_matches: 107,
    player_image: "https://api.dicebear.com/7.x/bottts/svg?seed=JosButtler"
  },
  {
    id: "DEMO-005",
    name: "Yuzvendra Chahal",
    role: "Bowler",
    country: "India",
    is_overseas: false,
    age: 34,
    batting_style: "RHB",
    bowling_style: "RIGHT ARM Leg Spin",
    base_price_lakh: 200,
    base_price_cr: 2.0,
    auction_set: "M2",
    auction_category: "Marquee players",
    ipl_matches: 160,
    player_image: "https://api.dicebear.com/7.x/bottts/svg?seed=YuzvendraChahal"
  }
];

const INITIAL_TEAMS = [
  { id: "CSK", name: "Chennai Super Kings", color: "#F9CD05", purse: 120.0, squad: 0, overseas: 0 },
  { id: "MI", name: "Mumbai Indians", color: "#004BA0", purse: 120.0, squad: 0, overseas: 0 },
  { id: "RCB", name: "Royal Challengers Bengaluru", color: "#DA1818", purse: 120.0, squad: 0, overseas: 0 },
  { id: "KKR", name: "Kolkata Knight Riders", color: "#3A225D", purse: 120.0, squad: 0, overseas: 0 },
  { id: "SRH", name: "Sunrisers Hyderabad", color: "#F26522", purse: 120.0, squad: 0, overseas: 0 },
  { id: "RR", name: "Rajasthan Royals", color: "#EA1A85", purse: 120.0, squad: 0, overseas: 0 },
  { id: "DC", name: "Delhi Capitals", color: "#004C97", purse: 120.0, squad: 0, overseas: 0 },
  { id: "PBKS", name: "Punjab Kings", color: "#DD1F2D", purse: 120.0, squad: 0, overseas: 0 },
  { id: "GT", name: "Gujarat Titans", color: "#1C2D42", purse: 120.0, squad: 0, overseas: 0 },
  { id: "LSG", name: "Lucknow Super Giants", color: "#0055A5", purse: 120.0, squad: 0, overseas: 0 }
];

export const PlayableDemoPage = ({ setActivePage }) => {
  const [demoMode, setDemoMode] = useState('mega'); // 'mega' or 'mini'
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [myTeamId, setMyTeamId] = useState('CSK');
  const [playerIdx, setPlayerIdx] = useState(0);
  const [currentBidLakh, setCurrentBidLakh] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const [bidLogs, setBidLogs] = useState([]);
  const [soldModal, setSoldModal] = useState(null);
  const [soldHistory, setSoldHistory] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);

  const activePlayer = SAMPLE_DEMO_PLAYERS[playerIdx] || SAMPLE_DEMO_PLAYERS[0];
  const baseLakh = activePlayer.base_price_lakh;

  // Next bid calculation
  const getNextBid = (curr, base) => {
    if (curr <= 0) return base;
    if (curr < 100) return curr + 20;
    if (curr < 500) return curr + 25;
    if (curr < 1000) return curr + 50;
    return curr + 100;
  };

  const nextMinBidLakh = getNextBid(currentBidLakh, baseLakh);
  const nextMinBidCr = (nextMinBidLakh / 100).toFixed(2);
  const currentBidCr = (currentBidLakh / 100).toFixed(2);

  // Timer loop
  useEffect(() => {
    if (!isRunning || soldModal) return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 4) soundManager.playTimerTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, soldModal, currentBidLakh, highestBidder]);

  const handleTimeExpired = () => {
    if (highestBidder && currentBidLakh > 0) {
      soundManager.playSoldFanfare();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#76DCC5', '#FFD700', '#B9F5E5']
      });

      // Deduct team wallet
      setTeams((prev) =>
        prev.map((t) => {
          if (t.id === highestBidder) {
            const spentCr = parseFloat(currentBidCr);
            return {
              ...t,
              purse: Math.max(0, parseFloat((t.purse - spentCr).toFixed(2))),
              squad: t.squad + 1,
              overseas: activePlayer.is_overseas ? t.overseas + 1 : t.overseas
            };
          }
          return t;
        })
      );

      const soldRecord = {
        player: activePlayer,
        team_id: highestBidder,
        price_lakh: currentBidLakh,
        price_cr: currentBidCr
      };

      setSoldHistory((prev) => [soldRecord, ...prev]);
      setSoldModal(soldRecord);
    } else {
      soundManager.playHammer();
      // Advance to next player
      setTimeout(() => advancePlayer(), 2000);
    }
  };

  const advancePlayer = () => {
    setSoldModal(null);
    const nextI = (playerIdx + 1) % SAMPLE_DEMO_PLAYERS.length;
    setPlayerIdx(nextI);
    setCurrentBidLakh(0);
    setHighestBidder(null);
    setCountdown(10);
    setBidLogs([]);
    setIsRunning(true);
  };

  // User places bid
  const handleUserBid = () => {
    if (highestBidder === myTeamId) return;

    soundManager.playBidSound();
    setCurrentBidLakh(nextMinBidLakh);
    setHighestBidder(myTeamId);
    setCountdown(10);

    const logEntry = {
      team: myTeamId,
      user: "You",
      lakh: nextMinBidLakh,
      cr: (nextMinBidLakh / 100).toFixed(2),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setBidLogs((prev) => [logEntry, ...prev]);

    // Trigger AI counter bid
    triggerAiCounter(nextMinBidLakh);
  };

  // Simulated AI counter bidding
  const triggerAiCounter = (userBidLakh) => {
    setTimeout(() => {
      // 70% chance of rival bot counter-bidding up to a ceiling
      const ceilingLakh = baseLakh * 5;
      if (userBidLakh < ceilingLakh) {
        const rivalTeams = teams.filter((t) => t.id !== myTeamId && t.purse > 10.0);
        if (rivalTeams.length > 0) {
          const chosen = rivalTeams[Math.floor(Math.random() * rivalTeams.length)];
          const aiBidLakh = getNextBid(userBidLakh, baseLakh);

          soundManager.playBidSound();
          setCurrentBidLakh(aiBidLakh);
          setHighestBidder(chosen.id);
          setCountdown(10);

          setBidLogs((prev) => [
            {
              team: chosen.id,
              user: `AI (${chosen.id})`,
              lakh: aiBidLakh,
              cr: (aiBidLakh / 100).toFixed(2),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            },
            ...prev
          ]);
        }
      }
    }, 2200);
  };

  const resetSimulation = () => {
    setTeams(INITIAL_TEAMS);
    setPlayerIdx(0);
    setCurrentBidLakh(0);
    setHighestBidder(null);
    setCountdown(10);
    setBidLogs([]);
    setSoldHistory([]);
    setSoldModal(null);
    setIsRunning(true);
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 py-6 space-y-4">
      
      {/* Top Banner: Demo Mode Announcement */}
      <div className="p-3.5 rounded-2xl bg-teal-panel/90 border border-mint-glacier/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-mint-glacier flex items-center justify-center text-fjord-950 font-bold">
            <PlayCircle className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-silver-soft uppercase tracking-wide">
                PLAYABLE DEMO AUCTION ARENA
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                Sample Data & AI Bots
              </span>
            </div>
            <p className="text-[11px] text-mist-grey">
              Instant interactive sandbox! Experience live counter-bidding, timer resets, and team wallet math.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => {
              const m = soundManager.toggleMute();
              setIsMuted(m);
            }}
            className="p-2 rounded-xl bg-fjord-950 border border-teal-border text-mist-grey hover:text-mint-glacier text-xs flex items-center gap-1.5"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-mint-glacier" />}
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-silver-soft text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-mint-glacier" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Demo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: 10 Franchise Budgets (3 cols) */}
        <div className="lg:col-span-3 glass-panel-elevated rounded-2xl p-4 border border-teal-border/60">
          <div className="pb-3 border-b border-teal-border/40 mb-3 flex items-center justify-between">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-silver-soft flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-mint-glacier" />
              <span>Franchise Standings (10)</span>
            </h4>
            <span className="text-[10px] text-mist-grey font-mono">LIVE PURSE</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div
                key={t.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  highestBidder === t.id
                    ? 'bg-mint-glacier/15 border-mint-glacier shadow-sm mint-glow-sm'
                    : myTeamId === t.id
                    ? 'bg-teal-hover border-mint-glacier/40'
                    : 'bg-teal-panel/70 border-teal-border/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.id}
                    </span>
                    <span className="text-xs font-bold text-silver-soft">
                      {t.id} {myTeamId === t.id && "★ (You)"}
                    </span>
                  </div>

                  <span className="font-display font-black text-sm text-mint-ice">
                    ₹{t.purse.toFixed(2)} Cr
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-mist-grey pt-1 border-t border-teal-border/30">
                  <span>Squad: {t.squad}/25</span>
                  <span>Overseas: {t.overseas}/8</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Live Player Podium (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel-elevated rounded-2xl p-6 border border-mint-glacier/30 shadow-2xl relative overflow-hidden">
            
            {/* Top Set & Timer Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-teal-border/40 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-teal-panel font-mono text-xs font-bold text-mint-ice border border-teal-border">
                  SET: {activePlayer.auction_set}
                </span>
                <span className="text-xs text-mint-glacier font-semibold">
                  {activePlayer.auction_category}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono font-bold text-lg">
                <Clock className={`w-5 h-5 ${countdown <= 3 ? 'text-red-400 animate-spin' : 'text-mint-glacier'}`} />
                <span className={countdown <= 3 ? 'text-red-400 text-2xl font-black' : 'text-mint-ice'}>
                  00:{countdown.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Spotlight Card */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-4 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-2xl bg-teal-panel border-2 border-mint-glacier/40 p-2 overflow-hidden shadow-lg mb-2">
                  <img src={activePlayer.player_image} alt={activePlayer.name} className="w-full h-full object-contain" />
                </div>
                <span className="px-3 py-0.5 rounded-full bg-teal-panel text-[11px] font-bold text-mint-glacier uppercase border border-teal-border">
                  {activePlayer.role}
                </span>
              </div>

              <div className="sm:col-span-8 space-y-3">
                <div>
                  <h3 className="font-display font-black text-3xl text-silver-soft uppercase">
                    {activePlayer.name}
                  </h3>
                  <p className="text-xs text-mist-grey">
                    {activePlayer.country} • Age: {activePlayer.age} • IPL Matches: {activePlayer.ipl_matches}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-fjord-950 border border-teal-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-mist-grey uppercase block">BASE PRICE</span>
                    <span className="font-display font-bold text-base text-silver-soft">
                      ₹{activePlayer.base_price_lakh} Lakh (₹{activePlayer.base_price_cr} Cr)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-mint-glacier uppercase font-bold block">
                      CURRENT BID
                    </span>
                    <span className="font-display font-black text-3xl text-mint-ice animate-pulse block leading-none">
                      {currentBidLakh > 0 ? `₹${currentBidCr} Cr` : `₹${activePlayer.base_price_cr} Cr`}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-teal-panel/90 border border-teal-border flex items-center justify-between text-xs">
                  <span className="text-mist-grey font-semibold">HOLDING BID:</span>
                  {highestBidder ? (
                    <span className="font-display font-black text-sm text-mint-ice uppercase">
                      {highestBidder} {highestBidder === myTeamId && "(YOUR PADDLE)"}
                    </span>
                  ) : (
                    <span className="text-mist-grey italic">Awaiting opening bid...</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sold History Carousel */}
          <div className="glass-panel rounded-2xl p-4 border border-teal-border/40">
            <span className="text-xs font-bold text-silver-soft uppercase tracking-wider block mb-2">
              Recently Sold in Demo ({soldHistory.length})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {soldHistory.length === 0 ? (
                <span className="text-xs text-mist-grey italic py-2">No players sold yet. Place bids and let timer expire!</span>
              ) : (
                soldHistory.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-teal-panel border border-gold-sold/30 text-xs shrink-0 min-w-[140px]">
                    <span className="font-bold text-silver-soft block truncate">{s.player.name}</span>
                    <span className="text-[10px] text-mist-grey block">{s.team_id}</span>
                    <span className="font-display font-black text-gold-sold text-sm block">₹{s.price_cr} Cr</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Paddle & Bid Action (3 cols) */}
        <div className="lg:col-span-3 glass-panel-elevated rounded-2xl p-4 border border-teal-border/60 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Paddle Selector */}
            <div>
              <label className="text-xs font-bold text-silver-soft uppercase block mb-1">
                Your Demo Franchise:
              </label>
              <select
                value={myTeamId}
                onChange={(e) => setMyTeamId(e.target.value)}
                className="w-full bg-fjord-950 text-silver-soft text-xs rounded-xl p-2.5 border border-teal-border focus:border-mint-glacier outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Main Bid Action Button */}
            <button
              onClick={handleUserBid}
              disabled={highestBidder === myTeamId}
              className={`w-full py-5 rounded-2xl font-display font-black text-xl uppercase tracking-wider transition-all flex flex-col items-center justify-center shadow-xl ${
                highestBidder === myTeamId
                  ? 'bg-teal-panel text-mint-ice/50 border border-mint-glacier/20 cursor-not-allowed'
                  : 'bg-mint-glacier hover:bg-mint-hover text-fjord-950 border border-mint-ice shadow-mint-glow active:scale-95'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 font-bold" />
                <span>
                  {highestBidder === myTeamId ? 'YOU HOLD BID' : `BID ₹${nextMinBidCr} CR`}
                </span>
              </div>
              <span className="text-xs font-sans font-semibold tracking-normal mt-0.5 opacity-90">
                {currentBidLakh > 0 ? `Raise +₹${nextMinBidLakh - currentBidLakh}L` : `Opening Bid`}
              </span>
            </button>

            {/* Live Feed */}
            <div>
              <span className="text-xs font-bold text-silver-soft uppercase tracking-wider block mb-2">
                Live Simulation Feed
              </span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 text-xs">
                {bidLogs.length === 0 ? (
                  <div className="text-center text-mist-grey py-6 italic">
                    Click the Bid button to compete against AI teams!
                  </div>
                ) : (
                  bidLogs.map((b, i) => (
                    <div key={i} className="p-2 rounded-lg bg-teal-panel/80 border border-teal-border/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-fjord-950 text-mint-ice">
                          {b.team}
                        </span>
                        <span className="font-semibold text-silver-soft">{b.user}</span>
                      </div>
                      <span className="font-display font-bold text-mint-glacier">
                        ₹{b.cr} Cr
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-teal-border/40">
            <button
              onClick={() => setActivePage('create-room')}
              className="w-full py-2.5 rounded-xl bg-teal-panel hover:bg-teal-hover border border-teal-border text-mint-glacier text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
            >
              <span>Ready to Host Real Room?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Sold Celebration Modal */}
      {soldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fjord-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-gold-sold/60 shadow-2xl text-center gold-glow">
            <span className="px-3 py-1 rounded-full bg-gold-sold/20 text-gold-sold text-xs font-black uppercase tracking-widest border border-gold-sold/40 inline-block mb-3">
              HAMMER SOLD IN DEMO!
            </span>
            <h3 className="font-display font-black text-3xl text-silver-soft uppercase mb-1">
              {soldModal.player.name}
            </h3>
            <p className="text-xs text-mist-grey mb-4">{soldModal.player.role} • {soldModal.player.country}</p>

            <div className="p-4 rounded-xl bg-teal-panel/90 border border-gold-sold/40 mb-6">
              <span className="text-[10px] text-mist-grey uppercase block mb-1">WINNING FRANCHISE</span>
              <span className="font-display font-black text-2xl text-silver-soft block mb-2">
                {soldModal.team_id}
              </span>
              <span className="font-display font-black text-3xl text-gold-sold block leading-none">
                ₹{soldModal.price_cr} CR
              </span>
            </div>

            <button
              onClick={advancePlayer}
              className="w-full py-3 rounded-xl bg-gold-sold hover:bg-amber-400 text-fjord-950 font-display font-bold text-sm uppercase tracking-wider transition-all"
            >
              Continue to Next Player
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


import React, { useState } from 'react';
import { Gavel, MessageSquare, History, AlertCircle, Send, Shield, Sparkles } from 'lucide-react';

export const RightBiddingPanel = ({
  claimedTeamId,
  onClaimTeam,
  onPlaceBid,
  nextMinBidLakh,
  currentBidLakh,
  basePriceLakh,
  highestBidder,
  bidHistory = [],
  chatMessages = [],
  onSendChatMessage,
  lastError,
  username,
  teams = []
}) => {
  const [activeTab, setActiveTab] = useState('bidding'); // 'bidding' or 'chat'
  const [chatInput, setChatInput] = useState('');

  const nextBidCr = (nextMinBidLakh / 100).toFixed(2);
  const incrementLakh = currentBidLakh > 0 ? nextMinBidLakh - currentBidLakh : 0;
  const isSelfHighest = highestBidder === claimedTeamId;

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-4 flex flex-col h-full border border-teal-border/60">
      
      {/* Tab Switcher: Bidding vs Live Chat */}
      <div className="flex items-center gap-1 p-1 bg-fjord-950 rounded-xl border border-teal-border/60 mb-3">
        <button
          onClick={() => setActiveTab('bidding')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'bidding'
              ? 'bg-teal-panel text-mint-glacier border border-mint-glacier/30 shadow-sm'
              : 'text-mist-grey hover:text-silver-soft'
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>Bidding</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-teal-panel text-mint-glacier border border-mint-glacier/30 shadow-sm'
              : 'text-mist-grey hover:text-silver-soft'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
          {chatMessages.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-mint-glacier animate-pulse" />
          )}
        </button>
      </div>

      {activeTab === 'bidding' ? (
        <div className="flex flex-col flex-1 justify-between">
          
          {/* Claim Franchise Banner or Status */}
          <div className="mb-3">
            {claimedTeamId ? (
              <div className="p-2.5 rounded-xl bg-teal-panel border border-mint-glacier/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-mint-glacier text-fjord-950 text-xs font-black flex items-center justify-center">
                    {claimedTeamId}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-silver-soft block leading-none">
                      {teams.find(t => t.id === claimedTeamId)?.name || claimedTeamId}
                    </span>
                    <span className="text-[10px] text-mint-glacier">Active Franchise Paddle</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-mint-glacier/20 text-mint-ice font-semibold">
                  Authorized
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40">
                <span className="text-xs font-bold text-amber-200 block mb-1.5">
                  Select Your Franchise To Bid:
                </span>
                <select
                  onChange={(e) => onClaimTeam(e.target.value)}
                  className="w-full text-xs bg-fjord-950 text-silver-soft border border-teal-border rounded-lg p-2 focus:border-mint-glacier outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Choose an IPL Franchise...</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {lastError && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2 text-xs text-red-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{lastError}</span>
            </div>
          )}

          {/* Primary Action Bid Button */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => onPlaceBid(nextMinBidLakh)}
              disabled={!claimedTeamId || isSelfHighest}
              className={`w-full py-4 rounded-xl font-display font-black text-lg md:text-xl tracking-wider transition-all flex flex-col items-center justify-center shadow-lg ${
                !claimedTeamId
                  ? 'bg-teal-panel/60 text-mist-grey cursor-not-allowed border border-teal-border/40'
                  : isSelfHighest
                  ? 'bg-teal-panel text-mint-ice/60 border border-mint-glacier/30 cursor-not-allowed'
                  : 'bg-mint-glacier hover:bg-mint-hover text-fjord-950 border border-mint-ice shadow-mint-glow active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 font-bold" />
                <span>
                  {isSelfHighest ? 'YOU HOLD HIGHEST BID' : `BID ₹${nextBidCr} CRORE`}
                </span>
              </div>
              <span className="text-[11px] font-sans font-semibold tracking-normal mt-0.5 opacity-90">
                {currentBidLakh > 0 ? `Raise by +₹${incrementLakh} Lakh` : `Opening Reserve Bid`}
              </span>
            </button>

            {isSelfHighest && (
              <p className="text-[11px] text-center text-mint-glacier font-medium">
                ✓ Your franchise is currently in the lead!
              </p>
            )}
          </div>

          {/* Live Bid History Feed */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-teal-border/40 mb-2">
              <span className="text-xs font-bold text-silver-soft flex items-center gap-1.5 uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-mint-glacier" />
                <span>Live Bid Feed</span>
              </span>
              <span className="text-[10px] text-mist-grey font-mono">{bidHistory.length} Bids Logged</span>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
              {bidHistory.length === 0 ? (
                <div className="py-6 text-center text-mist-grey text-xs italic">
                  No bids placed on this player yet.
                </div>
              ) : (
                bidHistory.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-teal-panel/60 border border-teal-border/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-fjord-950 text-mint-ice border border-teal-border">
                        {b.team_id}
                      </span>
                      <span className="font-semibold text-silver-soft truncate max-w-[90px]">
                        {b.username}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-extrabold text-mint-glacier block leading-none">
                        ₹{b.bid_amount_cr} Cr
                      </span>
                      <span className="text-[9px] text-mist-grey font-mono">{b.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Live Chat Tab */
        <div className="flex flex-col flex-1 justify-between">
          <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1 flex-1 mb-3">
            {chatMessages.length === 0 ? (
              <div className="py-8 text-center text-mist-grey text-xs italic">
                Welcome to the auction room! Chat with other team owners live.
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className="p-2 rounded-lg bg-teal-panel/80 border border-teal-border/40 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-mist-grey mb-1">
                    <span className="font-bold text-mint-glacier flex items-center gap-1">
                      {msg.team_id && (
                        <span className="px-1 rounded bg-fjord-950 text-[9px] font-mono text-mint-ice">
                          {msg.team_id}
                        </span>
                      )}
                      {msg.username}
                    </span>
                    <span className="font-mono text-[9px]">{msg.timestamp}</span>
                  </div>
                  <p className="text-silver-soft leading-snug break-words">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send message to room..."
              className="flex-1 bg-fjord-950 text-silver-soft text-xs rounded-xl px-3 py-2 border border-teal-border focus:border-mint-glacier outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-mint-glacier text-fjord-950 hover:bg-mint-hover transition-colors font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};


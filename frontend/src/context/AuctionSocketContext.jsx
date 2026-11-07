import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { soundManager } from '../services/soundEffects';
import confetti from 'canvas-confetti';

const AuctionSocketContext = createContext(null);

export const AuctionSocketProvider = ({ roomId, children }) => {
  const [auctionState, setAuctionState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastBidError, setLastBidError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [soldModalData, setSoldModalData] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const port = window.location.port === '3000' ? '8000' : (window.location.port || '8000');
    const wsUrl = `${protocol}//${window.location.hostname}:${port}/api/auction/ws/${roomId}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleSocketMessage(data);
      } catch (err) {
        console.error('Socket message parse error:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleSocketMessage = (data) => {
    switch (data.type) {
      case 'INITIAL_STATE':
        setAuctionState(data.state);
        break;

      case 'AUCTION_STARTED':
      case 'AUCTION_RESUMED':
      case 'NEXT_PLAYER':
        setAuctionState(data.state);
        setSoldModalData(null);
        soundManager.playBidSound();
        break;

      case 'TIMER_TICK':
        setAuctionState((prev) => prev ? { ...prev, countdown: data.countdown } : prev);
        if (data.countdown <= 3 && data.countdown > 0) {
          soundManager.playTimerTick();
        }
        break;

      case 'NEW_BID':
        setAuctionState((prev) => {
          if (!prev) return prev;
          const updatedHistory = [data.bid, ...(prev.bid_history || [])];
          return {
            ...prev,
            current_bid_lakh: data.current_bid_lakh,
            current_bid_cr: data.current_bid_cr,
            highest_bidder: data.highest_bidder,
            countdown: data.countdown,
            next_min_bid_lakh: data.next_min_bid_lakh,
            bid_history: updatedHistory
          };
        });
        soundManager.playBidSound();
        break;

      case 'PLAYER_SOLD':
        soundManager.playSoldFanfare();
        // Trigger celebratory confetti in gold and glacier mint
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#76DCC5', '#FFD700', '#B9F5E5', '#F59E0B']
          });
        } catch (e) {}

        setSoldModalData({
          player: data.player,
          team_id: data.team_id,
          price_lakh: data.price_lakh,
          price_cr: data.price_cr
        });

        setAuctionState((prev) => {
          if (!prev) return prev;
          const soldList = [
            {
              player: data.player,
              team_id: data.team_id,
              price_lakh: data.price_lakh,
              price_cr: data.price_cr
            },
            ...(prev.sold_players || [])
          ];
          const newTeamStates = { ...(prev.team_states || {}) };
          if (newTeamStates[data.team_id]) {
            newTeamStates[data.team_id] = {
              ...newTeamStates[data.team_id],
              ...data.team_state
            };
          }
          return {
            ...prev,
            sold_players: soldList,
            team_states: newTeamStates
          };
        });
        break;

      case 'PLAYER_UNSOLD':
        soundManager.playHammer();
        setAuctionState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            unsold_players: [data.player, ...(prev.unsold_players || [])]
          };
        });
        break;

      case 'BID_ERROR':
        setLastBidError(data.error);
        setTimeout(() => setLastBidError(null), 4000);
        break;

      case 'CHAT_BROADCAST':
        setChatMessages((prev) => [...prev.slice(-49), data]);
        break;

      default:
        break;
    }
  };

  const sendBid = (teamId, username, customAmountLakh) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'PLACE_BID',
        team_id: teamId,
        username,
        bid_amount_lakh: customAmountLakh
      }));
    }
  };

  const sendHostControl = (action, param = null) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'HOST_CONTROL',
        action,
        param
      }));
    }
  };

  const sendChatMessage = (username, teamId, text) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        username,
        team_id: teamId,
        text
      }));
    }
  };

  return (
    <AuctionSocketContext.Provider value={{
      auctionState,
      setAuctionState,
      isConnected,
      lastBidError,
      chatMessages,
      soldModalData,
      setSoldModalData,
      sendBid,
      sendHostControl,
      sendChatMessage
    }}>
      {children}
    </AuctionSocketContext.Provider>
  );
};

export const useAuctionSocket = () => useContext(AuctionSocketContext);


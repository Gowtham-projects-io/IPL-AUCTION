const API_BASE = '/api';

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async register(username, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async guestLogin() {
    const res = await fetch(`${API_BASE}/auth/guest-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Guest login failed');
    return res.json();
  },

  // Seasons
  async getSeason() {
    const res = await fetch(`${API_BASE}/seasons/current`);
    if (!res.ok) throw new Error('Failed to load season');
    return res.json();
  },

  // Teams
  async getTeams() {
    const res = await fetch(`${API_BASE}/teams/`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },

  async getTeamRetentions(teamId) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/retentions`);
    if (!res.ok) throw new Error('Failed to fetch team retentions');
    return res.json();
  },

  async getTeamSquadInRoom(teamId, roomId) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/squad/${roomId}`);
    if (!res.ok) throw new Error('Failed to fetch squad');
    return res.json();
  },

  // Players
  async getPlayers(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const res = await fetch(`${API_BASE}/players/?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
  },

  async getPlayerSets(mode = 'mega') {
    const res = await fetch(`${API_BASE}/players/sets?mode=${mode}`);
    if (!res.ok) throw new Error('Failed to fetch sets');
    return res.json();
  },

  // Rooms
  async createRoom(roomData) {
    const res = await fetch(`${API_BASE}/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to create room');
    }
    return res.json();
  },

  async getPublicRooms() {
    const res = await fetch(`${API_BASE}/rooms/public`);
    if (!res.ok) throw new Error('Failed to fetch public rooms');
    return res.json();
  },

  async getRoomByCode(code) {
    const res = await fetch(`${API_BASE}/rooms/code/${code}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Room not found');
    }
    return res.json();
  },

  async getRoomDetail(roomId) {
    const res = await fetch(`${API_BASE}/rooms/${roomId}`);
    if (!res.ok) throw new Error('Room not found');
    return res.json();
  },

  async getRoomParticipants(roomId) {
    const res = await fetch(`${API_BASE}/rooms/${roomId}/participants`);
    if (!res.ok) return [];
    return res.json();
  },

  async claimTeam(roomId, teamId, username) {
    const res = await fetch(`${API_BASE}/rooms/${roomId}/claim-team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: teamId, username })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to claim team');
    }
    return res.json();
  },

  // Live Auction
  async getLiveAuctionState(roomId) {
    const res = await fetch(`${API_BASE}/auction/${roomId}/state`);
    if (!res.ok) throw new Error('Failed to get auction state');
    return res.json();
  },

  async placeBid(roomId, teamId, username, bidAmountLakh) {
    const res = await fetch(`${API_BASE}/auction/${roomId}/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id: roomId,
        team_id: teamId,
        username,
        bid_amount_lakh: bidAmountLakh
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to place bid');
    }
    return res.json();
  },

  async hostControl(roomId, action, param = null) {
    const res = await fetch(`${API_BASE}/auction/${roomId}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, param })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Host action failed');
    }
    return res.json();
  },

  // Exports & Results
  async getAuctionResults(roomId) {
    const res = await fetch(`${API_BASE}/exports/results/${roomId}`);
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  // Admin
  async importCsv(file, mode = 'mega') {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/import-csv?mode=${mode}`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async updatePlayer(playerId, updates) {
    const res = await fetch(`${API_BASE}/admin/players/${playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update player');
    return res.json();
  },

  async resetDemo() {
    const res = await fetch(`${API_BASE}/admin/reset-demo`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo');
    return res.json();
  }
};

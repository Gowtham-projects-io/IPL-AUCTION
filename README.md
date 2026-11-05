# IPL Auction Arena 2027 🏏

![Glacier Mint Theme](https://img.shields.io/badge/Theme-Glacier%20Mint-76DCC5?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![WebSockets](https://img.shields.io/badge/RealTime-WebSockets%20Live%20Bidding-FF6F00?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A complete, modern, responsive sports-tech web application and realistic **IPL Auction Simulator** engineered for the **IPL 2027 season**. Users can create auction rooms, invite friends, bid in real-time, manage team purses, and build dream squads.

---

## 🌟 Distinctive "Glacier Mint" Broadcast Design

Crafted using a professional cricket broadcast palette:
- **Deep Fjord** (`#071C20`): Immersive stadium backdrop
- **Ocean Teal** (`#102D32`): Glassmorphism broadcast cards and panels
- **Glacier Mint** (`#76DCC5`): Primary bidding triggers and interactive paddles
- **Ice Mint** (`#B9F5E5`): Accent lighting and glowing metrics
- **Soft Silver** (`#DCE8E8`): High-legibility typography
- **Mist Grey** (`#8BA8AA`): Secondary technical labels
- **Gold Fanfare** (`#FFD700` / `#F59E0B`): Hammer-sold celebrations with animated confetti

---

## ⚡ Key Highlights & Features

### 1. Dual Game Modes
- **Mega Auction 2027**: 
  - Clean slate squads with ₹120.00 Crore purse for all 10 franchises.
  - Complete pool of 570+ players arranged into official sets (`M1`, `M2`, `BA1`, `AL1`, `WK1`, `FA1`, `SP1`, `UBA1`, `UAL1`...).
  - Maximum 8 overseas players, minimum 18 players required.
- **Mini Auction 2027**:
  - Franchise-wise retained superstar cores (Kohli, Bumrah, Gaikwad, Klaasen, Samson, etc.) pre-allocated.
  - Remaining purse automatically calculated after retention deductions.
  - Auction pool comprises released superstars and newly nominated talents.

### 2. Real-Time Bidding Engine & WebSockets
- Genuine server-side bidding logic with atomic locking to handle simultaneous bids safely.
- **Dynamic BCCI Increments**:
  - Under ₹1.00 Cr: +₹20 Lakh
  - ₹1.00 Cr to ₹5.00 Cr: +₹25 Lakh
  - ₹5.00 Cr to ₹10.00 Cr: +₹50 Lakh
  - Above ₹10.00 Cr: +₹100 Lakh (₹1.00 Cr)
- **10-Second Auto-Reset Timer**: Resets back to 10s upon every valid bid.
- **Budget Protection Rule**: Prevents bids that would leave insufficient funds to fill the minimum 18-player squad with ₹30L base-price players.
- **Procedural Web Audio API Sound Synthesizer**: Authentic wood gavel hammer sound, countdown beeps, and sold fanfare.

### 3. All 10 Official IPL Franchises
1. **Chennai Super Kings (CSK)** - `#F9CD05` / `#00539F`
2. **Mumbai Indians (MI)** - `#004BA0` / `#D1AB3E`
3. **Royal Challengers Bengaluru (RCB)** - `#DA1818` / `#000000`
4. **Kolkata Knight Riders (KKR)** - `#3A225D` / `#D4AF37`
5. **Sunrisers Hyderabad (SRH)** - `#F26522` / `#000000`
6. **Rajasthan Royals (RR)** - `#EA1A85` / `#004BA0`
7. **Delhi Capitals (DC)** - `#004C97` / `#EF1C24`
8. **Punjab Kings (PBKS)** - `#DD1F2D` / `#C49533`
9. **Gujarat Titans (GT)** - `#1C2D42` / `#D1AB3E`
10. **Lucknow Super Giants (LSG)** - `#0055A5` / `#FF5722`

### 4. Official CSV Management
- Downloadable official CSVs:
  - `IPL_2027_Mega_Auction_Players.csv`
  - `IPL_2027_Mini_Auction_Players.csv`
- Admin CSV upload tool with automatic format validation and error diagnostics.

### 5. Playable Demo Mode
- Instant 1-click playable demo auction with simulated AI franchise bidders counter-bidding in real-time, allowing immediate evaluation of live bidding mechanics without needing other human participants.

---

## 📂 Project Structure

```
ipl_auction_simulation/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app, static mounting, CORS
│   │   ├── config.py                 # Application settings & constants
│   │   ├── database.py               # SQLAlchemy SQLite/PostgreSQL setup
│   │   ├── models.py                 # ORM models (User, Team, Player, Room, etc.)
│   │   ├── schemas.py                # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── bidding_engine.py     # Live bidding manager, timer, AI bots
│   │   │   ├── auth_service.py       # JWT & password hashing
│   │   │   ├── csv_service.py        # CSV import validator
│   │   │   └── seed_service.py       # Default database seeding
│   │   └── routers/
│   │       ├── auth.py, seasons.py, teams.py, players.py
│   │       ├── rooms.py, auction.py, admin.py, exports.py
│   ├── data/
│   │   ├── IPL_2027_Mega_Auction_Players.csv
│   │   ├── IPL_2027_Mini_Auction_Players.csv
│   │   ├── mega_players_seed.json
│   │   ├── mini_players_seed.json
│   │   ├── teams_config.json
│   │   └── initial_retentions_2027.json
│   └── run.py                        # Uvicorn entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx, Footer.jsx
│   │   │   └── live-auction/
│   │   │       ├── CenterAuctionStage.jsx
│   │   │       ├── LeftTeamRoster.jsx
│   │   │       ├── RightBiddingPanel.jsx
│   │   │       ├── BottomUpcomingQueue.jsx
│   │   │       ├── SoldCelebrationModal.jsx
│   │   │       └── HostControlsBar.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx, CreateRoomPage.jsx, JoinRoomPage.jsx
│   │   │   ├── PublicRoomsPage.jsx, MegaAuctionSetupPage.jsx, MiniAuctionSetupPage.jsx
│   │   │   ├── AuctionLobbyPage.jsx, LiveAuctionPage.jsx, TeamSquadPage.jsx
│   │   │   ├── PlayerDatabasePage.jsx, AuctionResultsPage.jsx, AdminDashboardPage.jsx
│   │   │   ├── UserProfilePage.jsx, PlayableDemoPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── AuctionSocketContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── soundEffects.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Quickstart & Execution

### 1. Backend Server
```powershell
python backend/run.py
```
Backend runs at `http://127.0.0.1:8000` with Swagger docs available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Development Server
```powershell
cd frontend
npm run dev
```
Frontend runs at `http://localhost:3000`.

### 3. Production Build
```powershell
npm run build --prefix frontend
```
The FastAPI backend serves the production bundle directly at `http://127.0.0.1:8000/`.

---

## 📋 Git Repository Push

To publish to your GitHub repository:
```bash
git init
git add .
git commit -m "feat: complete IPL Auction Arena 2027 platform"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

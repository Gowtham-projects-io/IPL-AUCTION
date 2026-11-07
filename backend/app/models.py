import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    is_admin = Column(Boolean, default=False)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Season(Base):
    __tablename__ = "seasons"
    
    id = Column(String(50), primary_key=True)  # "ipl-2027"
    name = Column(String(100), nullable=False)  # "IPL 2027 Season"
    year = Column(Integer, default=2027)
    default_purse_cr = Column(Float, default=120.0)
    min_squad = Column(Integer, default=18)
    max_squad = Column(Integer, default=25)
    max_overseas = Column(Integer, default=8)
    countdown_seconds = Column(Integer, default=10)
    status = Column(String(20), default="active")  # active, archived
    rules_notes = Column(Text, nullable=True)

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(String(10), primary_key=True)  # CSK, MI, RCB, etc.
    name = Column(String(100), nullable=False)
    short_name = Column(String(10), nullable=False)
    primary_color = Column(String(20), default="#76DCC5")
    secondary_color = Column(String(20), default="#102D32")
    logo = Column(String(255), nullable=True)
    default_purse_cr = Column(Float, default=120.0)

class Player(Base):
    __tablename__ = "players"
    
    id = Column(String(50), primary_key=True, index=True)  # IPL27-MEGA-001
    name = Column(String(100), index=True, nullable=False)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    country = Column(String(50), index=True, nullable=False)
    is_overseas = Column(Boolean, default=False)
    state_association = Column(String(50), nullable=True)
    dob = Column(String(20), nullable=True)
    age = Column(Integer, default=25)
    role = Column(String(30), index=True, nullable=False)  # Batter, Bowler, All-rounder, Wicketkeeper
    batting_style = Column(String(50), default="RHB")
    bowling_style = Column(String(100), default="None")
    test_caps = Column(Integer, default=0)
    odi_caps = Column(Integer, default=0)
    t20_caps = Column(Integer, default=0)
    ipl_matches = Column(Integer, default=0)
    previous_teams = Column(String(200), nullable=True)
    recent_team = Column(String(50), nullable=True)
    capped_status = Column(String(30), default="Capped")  # Capped, Uncapped, Associate
    base_price_lakh = Column(Integer, default=200)
    base_price_cr = Column(Float, default=2.0)
    auction_category = Column(String(50), index=True, default="Capped Indian players")
    auction_set = Column(String(20), index=True, default="BA1")
    player_image = Column(String(255), nullable=True)
    availability = Column(String(30), default="Available")  # Available, Injured, Unconfirmed
    auction_mode = Column(String(20), default="both")  # mega, mini, both
    data_status = Column(String(100), default="Confirmed Official Data (BCCI IPL Auction Registry)")

class Retention(Base):
    __tablename__ = "retentions"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(String(10), ForeignKey("teams.id"), nullable=False)
    player_name = Column(String(100), nullable=False)
    role = Column(String(30), default="Batter")
    country = Column(String(50), default="India")
    retention_slab = Column(String(50), default="Retention 1")
    retention_cost_cr = Column(Float, default=18.0)
    is_uncapped = Column(Boolean, default=False)

class AuctionRoom(Base):
    __tablename__ = "auction_rooms"
    
    id = Column(String(50), primary_key=True)  # UUID or string
    room_code = Column(String(20), unique=True, index=True, nullable=False)  # IPL-2027-X9K
    name = Column(String(100), nullable=False)
    host_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    auction_mode = Column(String(20), default="mega")  # mega, mini
    purse_cr = Column(Float, default=120.0)
    countdown_sec = Column(Integer, default=10)
    is_public = Column(Boolean, default=True)
    status = Column(String(20), default="waiting")  # waiting, active, paused, completed
    current_player_index = Column(Integer, default=0)
    current_player_id = Column(String(50), nullable=True)
    current_bid_lakh = Column(Integer, default=0)
    current_bid_cr = Column(Float, default=0.0)
    highest_bidder_team_id = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RoomParticipant(Base):
    __tablename__ = "room_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String(50), ForeignKey("auction_rooms.id"), index=True, nullable=False)
    user_id = Column(Integer, nullable=True)
    username = Column(String(50), nullable=False)
    claimed_team_id = Column(String(10), nullable=True)
    is_host = Column(Boolean, default=False)
    is_spectator = Column(Boolean, default=False)
    is_connected = Column(Boolean, default=True)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

class RoomTeamState(Base):
    __tablename__ = "room_team_states"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String(50), ForeignKey("auction_rooms.id"), index=True, nullable=False)
    team_id = Column(String(10), ForeignKey("teams.id"), nullable=False)
    total_purse_cr = Column(Float, default=120.0)
    spent_purse_cr = Column(Float, default=0.0)
    remaining_purse_cr = Column(Float, default=120.0)
    squad_count = Column(Integer, default=0)
    overseas_count = Column(Integer, default=0)

class SquadMember(Base):
    __tablename__ = "squad_members"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String(50), ForeignKey("auction_rooms.id"), index=True, nullable=False)
    team_id = Column(String(10), ForeignKey("teams.id"), index=True, nullable=False)
    player_id = Column(String(50), nullable=True)
    player_name = Column(String(100), nullable=False)
    role = Column(String(30), nullable=False)
    country = Column(String(50), nullable=False)
    is_overseas = Column(Boolean, default=False)
    price_lakh = Column(Integer, default=0)
    price_cr = Column(Float, default=0.0)
    is_retained = Column(Boolean, default=False)
    acquired_at = Column(DateTime, default=datetime.datetime.utcnow)

class BidLog(Base):
    __tablename__ = "bid_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String(50), ForeignKey("auction_rooms.id"), index=True, nullable=False)
    player_id = Column(String(50), nullable=False)
    team_id = Column(String(10), nullable=False)
    username = Column(String(50), nullable=False)
    bid_amount_lakh = Column(Integer, nullable=False)
    bid_amount_cr = Column(Float, nullable=False)
    bid_time = Column(DateTime, default=datetime.datetime.utcnow)


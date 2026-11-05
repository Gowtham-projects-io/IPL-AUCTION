from typing import List, Optional
from pydantic import BaseModel, EmailStr
import datetime

# User Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Season Schemas
class SeasonOut(BaseModel):
    id: str
    name: str
    year: int
    default_purse_cr: float
    min_squad: int
    max_squad: int
    max_overseas: int
    countdown_seconds: int
    status: str
    rules_notes: Optional[str] = None

    class Config:
        from_attributes = True

# Team Schemas
class TeamOut(BaseModel):
    id: str
    name: str
    short_name: str
    primary_color: str
    secondary_color: str
    logo: Optional[str] = None
    default_purse_cr: float

    class Config:
        from_attributes = True

# Retention Schemas
class RetentionOut(BaseModel):
    id: int
    team_id: str
    player_name: str
    role: str
    country: str
    retention_slab: str
    retention_cost_cr: float
    is_uncapped: bool

    class Config:
        from_attributes = True

# Player Schemas
class PlayerOut(BaseModel):
    id: str
    name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: str
    is_overseas: bool
    state_association: Optional[str] = None
    dob: Optional[str] = None
    age: int
    role: str
    batting_style: str
    bowling_style: str
    test_caps: int
    odi_caps: int
    t20_caps: int
    ipl_matches: int
    previous_teams: Optional[str] = None
    recent_team: Optional[str] = None
    capped_status: str
    base_price_lakh: int
    base_price_cr: float
    auction_category: str
    auction_set: str
    player_image: Optional[str] = None
    availability: str
    auction_mode: str
    data_status: str

    class Config:
        from_attributes = True

# Room Schemas
class RoomCreate(BaseModel):
    name: str
    auction_mode: str = "mega"  # mega or mini
    purse_cr: Optional[float] = 120.0
    countdown_sec: Optional[int] = 10
    is_public: Optional[bool] = True

class RoomParticipantOut(BaseModel):
    id: int
    room_id: str
    user_id: Optional[int] = None
    username: str
    claimed_team_id: Optional[str] = None
    is_host: bool
    is_spectator: bool
    is_connected: bool

    class Config:
        from_attributes = True

class RoomTeamStateOut(BaseModel):
    team_id: str
    total_purse_cr: float
    spent_purse_cr: float
    remaining_purse_cr: float
    squad_count: int
    overseas_count: int

    class Config:
        from_attributes = True

class SquadMemberOut(BaseModel):
    id: int
    room_id: str
    team_id: str
    player_id: Optional[str] = None
    player_name: str
    role: str
    country: str
    is_overseas: bool
    price_lakh: int
    price_cr: float
    is_retained: bool

    class Config:
        from_attributes = True

class BidLogOut(BaseModel):
    id: int
    player_id: str
    team_id: str
    username: str
    bid_amount_lakh: int
    bid_amount_cr: float
    bid_time: datetime.datetime

    class Config:
        from_attributes = True

class AuctionRoomOut(BaseModel):
    id: str
    room_code: str
    name: str
    host_user_id: Optional[int] = None
    auction_mode: str
    purse_cr: float
    countdown_sec: int
    is_public: bool
    status: str
    current_player_index: int
    current_player_id: Optional[str] = None
    current_bid_lakh: int
    current_bid_cr: float
    highest_bidder_team_id: Optional[str] = None
    created_at: datetime.datetime
    participants_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Bid Actions
class ClaimTeamRequest(BaseModel):
    team_id: str
    username: str

class PlaceBidRequest(BaseModel):
    room_id: str
    team_id: str
    username: str
    bid_amount_lakh: Optional[int] = None

class HostControlRequest(BaseModel):
    action: str  # start, pause, resume, sold, unsold, next, reset
    param: Optional[str] = None

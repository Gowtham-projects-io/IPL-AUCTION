import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath("."))

from backend.app.services.bidding_engine import bidding_manager
from backend.app.database import SessionLocal

db = SessionLocal()
bidding_manager.init_room_state_if_needed('room-123', db)
db.close()

bidding_manager.room_states['room-123']['status'] = 'active'
bidding_manager.room_states['room-123']['enable_ai_bots'] = False

async def main():
    print("STEP 1: before place_bid")
    res = await bidding_manager.place_bid('room-123', 'CSK', 'Tester', 200)
    print("STEP 2: after place_bid", res)

asyncio.run(main())

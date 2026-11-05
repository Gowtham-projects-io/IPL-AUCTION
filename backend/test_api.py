import os
import sys

# Ensure unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.bidding_engine import bidding_manager

def run_tests():
    print("========================================")
    print("IPL AUCTION ARENA 2027 - SYSTEM TEST")
    print("========================================")
    
    with TestClient(app) as client:
        # 1. Health
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("✓ Health check OK:", res.json())

        # 2. Season
        res = client.get("/api/seasons/current")
        assert res.status_code == 200, f"Season check failed: {res.text}"
        season_data = res.json()
        assert season_data["year"] == 2027
        print(f"✓ Season verified: {season_data['name']} (Purse: ₹{season_data['default_purse_cr']} Cr)")

        # 3. Teams
        res = client.get("/api/teams/")
        assert res.status_code == 200
        teams = res.json()
        assert len(teams) == 10, f"Expected 10 teams, got {len(teams)}"
        team_ids = [t["id"] for t in teams]
        print(f"✓ 10 IPL Franchises verified: {', '.join(team_ids)}")

        # 4. Retentions
        res = client.get("/api/teams/CSK/retentions")
        assert res.status_code == 200
        csk_ret = res.json()
        print(f"✓ CSK Retentions verified: {len(csk_ret)} players (e.g. {', '.join(r['player_name'] for r in csk_ret)})")

        # 5. Players
        res = client.get("/api/players/?limit=5")
        assert res.status_code == 200
        players = res.json()
        assert len(players) > 0
        print(f"✓ Players verified: {len(players)} loaded (First: {players[0]['name']}, Base: ₹{players[0]['base_price_lakh']}L)")

        # 6. Sets
        res = client.get("/api/players/sets?mode=mega")
        assert res.status_code == 200
        sets_data = res.json()
        print(f"✓ Auction Sets verified: {', '.join(sets_data['sets'][:8])}...")

        # 7. Create Room
        room_payload = {
            "name": "Championship 2027 Test Arena",
            "auction_mode": "mega",
            "purse_cr": 120.0,
            "countdown_sec": 10,
            "is_public": True
        }
        res = client.post("/api/rooms/create", json=room_payload)
        assert res.status_code == 200, f"Room creation failed: {res.text}"
        room = res.json()
        room_id = room["id"]
        print(f"✓ Room Created: {room['name']} (Code: {room['room_code']}, Mode: {room['auction_mode']})")

        # 8. Claim Team
        claim_payload = {"team_id": "CSK", "username": "TestBidder1"}
        res = client.post(f"/api/rooms/{room_id}/claim-team", json=claim_payload)
        assert res.status_code == 200
        print(f"✓ Team Claimed: CSK claimed by TestBidder1")

        # 9. Live Auction State
        res = client.get(f"/api/auction/{room_id}/state")
        assert res.status_code == 200
        state = res.json()
        print(f"✓ Live Auction State initialized: Player: {state.get('current_player', {}).get('name')}, Queue: {state['total_players_in_pool']} players")

        # 10. Place Bid
        # Disable bots for predictable test
        bidding_manager.room_states[room_id]["enable_ai_bots"] = False
        bidding_manager.room_states[room_id]["status"] = "active"

        bid_payload = {
            "room_id": room_id,
            "team_id": "CSK",
            "username": "TestBidder1",
            "bid_amount_lakh": 200
        }
        res = client.post(f"/api/auction/{room_id}/bid", json=bid_payload)
        assert res.status_code == 200, f"Bid failed: {res.text}"
        bid_res = res.json()
        print(f"✓ Bid Placed: ₹{bid_res['bid']['bid_amount_cr']} Cr by {bid_res['bid']['team_id']}")

        # 11. Download CSVs
        res = client.get("/api/exports/csv/mega")
        assert res.status_code == 200
        print(f"✓ Mega Auction CSV Download verified: {len(res.content)} bytes")

        res = client.get("/api/exports/csv/mini")
        assert res.status_code == 200
        print(f"✓ Mini Auction CSV Download verified: {len(res.content)} bytes")

        # Cleanup timer task
        bidding_manager.pause_auction(room_id)

    print("========================================")
    print("ALL 11 SYSTEM INTEGRATION TESTS PASSED!")
    print("========================================")

if __name__ == "__main__":
    run_tests()

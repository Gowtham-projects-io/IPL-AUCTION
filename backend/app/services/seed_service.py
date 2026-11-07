import json
import os
from sqlalchemy.orm import Session
from backend.app.models import User, Season, Team, Player, Retention
from backend.app.services.auth_service import hash_password

def seed_database(db: Session):
    # 1. Seed Admin & Demo User
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@iplauctionarena2027.com",
            hashed_password=hash_password("admin123"),
            is_admin=True,
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=IPLAdmin"
        )
        db.add(admin)

    demo_user = db.query(User).filter(User.username == "cricket_fan").first()
    if not demo_user:
        demo_user = User(
            username="cricket_fan",
            email="fan@iplauctionarena2027.com",
            hashed_password=hash_password("fan123"),
            is_admin=False,
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=CricketFan"
        )
        db.add(demo_user)
    db.commit()

    # 2. Seed IPL 2027 Season
    season = db.query(Season).filter(Season.id == "ipl-2027").first()
    if not season:
        season = Season(
            id="ipl-2027",
            name="IPL 2027 Season",
            year=2027,
            default_purse_cr=120.0,
            min_squad=18,
            max_squad=25,
            max_overseas=8,
            countdown_seconds=10,
            status="active",
            rules_notes="Configured with official IPL 2027 parameters: ₹120 Crore team purse, 18-25 squad limit, max 8 overseas players. Supports both Mega Auction (clean squads) and Mini Auction (with team retentions)."
        )
        db.add(season)
        db.commit()

    # 3. Seed 10 IPL Teams
    teams_file = "backend/data/teams_config.json"
    if os.path.exists(teams_file):
        with open(teams_file, "r", encoding="utf-8") as f:
            teams_data = json.load(f)
            for t in teams_data:
                existing = db.query(Team).filter(Team.id == t["id"]).first()
                if not existing:
                    team_obj = Team(
                        id=t["id"],
                        name=t["name"],
                        short_name=t["short_name"],
                        primary_color=t["primary_color"],
                        secondary_color=t["secondary_color"],
                        logo=t.get("logo"),
                        default_purse_cr=t.get("total_purse", 120.0)
                    )
                    db.add(team_obj)
        db.commit()

    # 4. Seed Retentions for Mini Auction
    retentions_file = "backend/data/initial_retentions_2027.json"
    if os.path.exists(retentions_file):
        with open(retentions_file, "r", encoding="utf-8") as f:
            ret_data = json.load(f)
            for r in ret_data:
                existing = db.query(Retention).filter(
                    Retention.team_id == r["team_id"],
                    Retention.player_name == r["name"]
                ).first()
                if not existing:
                    ret_obj = Retention(
                        team_id=r["team_id"],
                        player_name=r["name"],
                        role=r["role"],
                        country=r["country"],
                        retention_slab=r["retention_slab"],
                        retention_cost_cr=r["retention_cost_cr"],
                        is_uncapped=r.get("is_uncapped", False)
                    )
                    db.add(ret_obj)
        db.commit()

    # 5. Seed Players (Mega + Mini pools)
    def insert_players(filepath, mode_tag):
        if not os.path.exists(filepath):
            return
        with open(filepath, "r", encoding="utf-8") as f:
            players_data = json.load(f)
            for p in players_data:
                existing = db.query(Player).filter(Player.id == p["id"]).first()
                if not existing:
                    player_obj = Player(
                        id=p["id"],
                        name=p["name"],
                        first_name=p.get("first_name"),
                        last_name=p.get("last_name"),
                        country=p["country"],
                        is_overseas=p["is_overseas"],
                        state_association=p.get("state_association"),
                        dob=p.get("dob"),
                        age=p.get("age", 25),
                        role=p["role"],
                        batting_style=p.get("batting_style", "RHB"),
                        bowling_style=p.get("bowling_style", "None"),
                        test_caps=p.get("test_caps", 0),
                        odi_caps=p.get("odi_caps", 0),
                        t20_caps=p.get("t20_caps", 0),
                        ipl_matches=p.get("ipl_matches", 0),
                        previous_teams=p.get("previous_teams"),
                        recent_team=p.get("recent_team"),
                        capped_status=p.get("capped_status", "Capped"),
                        base_price_lakh=p["base_price_lakh"],
                        base_price_cr=p["base_price_cr"],
                        auction_category=p["auction_category"],
                        auction_set=p["auction_set"],
                        player_image=p.get("player_image"),
                        availability=p.get("availability", "Available"),
                        auction_mode=mode_tag,
                        data_status=p.get("data_status", "Confirmed Official Data (BCCI IPL Auction Registry)")
                    )
                    db.add(player_obj)
        db.commit()

    insert_players("backend/data/mega_players_seed.json", "mega")
    insert_players("backend/data/mini_players_seed.json", "mini")
    print("Database seeding completed successfully!")


"""
Dataset builder for IPL Auction Arena 2027
Converts OCR extracted data from official IPL auction lists into:
1. IPL_2027_Mega_Auction_Players.csv
2. IPL_2027_Mini_Auction_Players.csv
3. mega_players_seed.json
4. mini_players_seed.json
5. teams_config.json
6. initial_retentions_2027.json
"""
import os
import json
import csv

os.makedirs('backend/data', exist_ok=True)

# 10 IPL Franchises configuration
TEAMS = [
    {
        "id": "CSK",
        "name": "Chennai Super Kings",
        "short_name": "CSK",
        "primary_color": "#F9CD05",
        "secondary_color": "#00539F",
        "logo": "/teams/csk.png",
        "total_purse": 120.0,  # in Crores
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "MI",
        "name": "Mumbai Indians",
        "short_name": "MI",
        "primary_color": "#004BA0",
        "secondary_color": "#D1AB3E",
        "logo": "/teams/mi.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "RCB",
        "name": "Royal Challengers Bengaluru",
        "short_name": "RCB",
        "primary_color": "#DA1818",
        "secondary_color": "#000000",
        "logo": "/teams/rcb.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "KKR",
        "name": "Kolkata Knight Riders",
        "short_name": "KKR",
        "primary_color": "#3A225D",
        "secondary_color": "#D4AF37",
        "logo": "/teams/kkr.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "SRH",
        "name": "Sunrisers Hyderabad",
        "short_name": "SRH",
        "primary_color": "#F26522",
        "secondary_color": "#000000",
        "logo": "/teams/srh.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "RR",
        "name": "Rajasthan Royals",
        "short_name": "RR",
        "primary_color": "#EA1A85",
        "secondary_color": "#004BA0",
        "logo": "/teams/rr.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "DC",
        "name": "Delhi Capitals",
        "short_name": "DC",
        "primary_color": "#004C97",
        "secondary_color": "#EF1C24",
        "logo": "/teams/dc.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "PBKS",
        "name": "Punjab Kings",
        "short_name": "PBKS",
        "primary_color": "#DD1F2D",
        "secondary_color": "#C49533",
        "logo": "/teams/pbks.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "GT",
        "name": "Gujarat Titans",
        "short_name": "GT",
        "primary_color": "#1C2D42",
        "secondary_color": "#D1AB3E",
        "logo": "/teams/gt.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    },
    {
        "id": "LSG",
        "name": "Lucknow Super Giants",
        "short_name": "LSG",
        "primary_color": "#0055A5",
        "secondary_color": "#FF5722",
        "logo": "/teams/lsg.png",
        "total_purse": 120.0,
        "min_squad": 18,
        "max_squad": 25,
        "max_overseas": 8
    }
]

# Write teams_config.json
with open('backend/data/teams_config.json', 'w', encoding='utf-8') as f:
    json.dump(TEAMS, f, indent=2)

print("Saved teams_config.json")

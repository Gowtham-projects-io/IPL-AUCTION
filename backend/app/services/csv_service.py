import csv
import io
from typing import List, Dict, Any, Tuple

REQUIRED_CSV_FIELDS = [
    "Player name",
    "Role",
    "Country",
    "Base price",
    "Auction category",
    "Auction set"
]

def validate_and_parse_player_csv(csv_content: str) -> Tuple[bool, List[Dict[str, Any]], List[str]]:
    """
    Validates user uploaded CSV files against required schema.
    Returns: (is_valid, parsed_players_list, errors_list)
    """
    errors = []
    players = []
    
    try:
        f = io.StringIO(csv_content)
        reader = csv.DictReader(f)
        
        # Check header
        headers = reader.fieldnames or []
        cleaned_headers = [h.strip().lower() for h in headers]
        
        # Header mapping
        header_map = {}
        for req in REQUIRED_CSV_FIELDS:
            matched = False
            for h in headers:
                if req.lower() in h.lower():
                    header_map[req] = h
                    matched = True
                    break
            if not matched:
                errors.append(f"Missing required CSV column: '{req}'")
                
        if errors:
            return False, [], errors

        for row_num, row in enumerate(reader, start=2):
            p_name = row.get(header_map["Player name"], "").strip()
            if not p_name:
                errors.append(f"Row {row_num}: 'Player name' cannot be empty.")
                continue

            role_val = row.get(header_map["Role"], "").strip().capitalize()
            if role_val not in ["Batter", "Bowler", "All-rounder", "Wicketkeeper"]:
                # Normalization
                if "wk" in role_val.lower() or "keep" in role_val.lower():
                    role_val = "Wicketkeeper"
                elif "all" in role_val.lower():
                    role_val = "All-rounder"
                elif "bowl" in role_val.lower():
                    role_val = "Bowler"
                else:
                    role_val = "Batter"

            country = row.get(header_map["Country"], "India").strip()
            
            # Base price parsing (handle lakhs or crores)
            price_raw = row.get(header_map["Base price"], "30").replace("₹", "").replace("Cr", "").replace("Lakh", "").replace(",", "").strip()
            try:
                price_float = float(price_raw)
                # If price is like 1.5 or 2.0, user probably entered in Crores, convert to Lakhs
                if price_float < 10.0:
                    base_price_lakh = int(price_float * 100)
                else:
                    base_price_lakh = int(price_float)
            except ValueError:
                base_price_lakh = 30
                errors.append(f"Row {row_num}: Invalid base price '{price_raw}' - defaulted to 30 Lakh.")

            cat = row.get(header_map["Auction category"], "Capped Indian players").strip()
            aset = row.get(header_map["Auction set"], "BA1").strip().upper()
            
            # Optional extra fields
            prev_team = ""
            for h in headers:
                if "prev" in h.lower():
                    prev_team = row.get(h, "").strip()
                    break
                    
            is_overseas = (country.lower() != "india")
            player_dict = {
                "name": p_name,
                "role": role_val,
                "country": country,
                "is_overseas": is_overseas,
                "base_price_lakh": base_price_lakh,
                "base_price_cr": round(base_price_lakh / 100.0, 2),
                "auction_category": cat,
                "auction_set": aset,
                "previous_teams": prev_team,
                "availability": "Available",
                "data_status": "Custom Uploaded Player Data"
            }
            players.append(player_dict)

        if not players:
            errors.append("CSV file contains no player data rows.")

        return len(errors) == 0, players, errors

    except Exception as e:
        return False, [], [f"Failed to parse CSV format: {str(e)}"]


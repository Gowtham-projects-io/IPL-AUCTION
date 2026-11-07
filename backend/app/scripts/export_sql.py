import sqlite3
import pathlib
import sys

# Resolve database path
project_root = pathlib.Path(__file__).resolve().parents[3]
db_path = project_root / 'backend' / 'data' / 'ipl_auction_2027.db'
sql_dump_path = project_root / 'backend' / 'data' / 'ipl_auction_2027_dump.sql'

if not db_path.exists():
    print(f'Database not found at {db_path}', file=sys.stderr)
    sys.exit(1)

try:
    conn = sqlite3.connect(str(db_path))
    with open(sql_dump_path, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            f.write(f"{line}\n")
    print(f'SQL dump created at {sql_dump_path}')
finally:
    conn.close()


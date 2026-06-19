import sqlite3
import psycopg2
from datetime import datetime

# -----------------------------
# CONFIGURATION
# -----------------------------
SQLITE_DB = "/home/sadmin/db/custom.db"

PG_CONN = {
    "host": "ep-cool-morning-atqn4df3.c-9.us-east-1.aws.neon.tech",
    "dbname": "neondb",
    "user": "neondb_owner",
    "password": "npg_FVXzAG0l2wiM",   # <-- Replace with your Neon password
    "sslmode": "require"
}

TABLES = [
    "User",
    "Technology",
    "Scenario",
    "Account",
    "Session",
    "VerificationToken",
    "Solution",
    "Vote"
]

# -----------------------------
# CONNECT
# -----------------------------
sqlite_conn = sqlite3.connect(SQLITE_DB)
sqlite_conn.row_factory = sqlite3.Row
sqlite_cur = sqlite_conn.cursor()

pg_conn = psycopg2.connect(**PG_CONN)
pg_cur = pg_conn.cursor()

# -----------------------------
# READ POSTGRES COLUMNS
# -----------------------------
pg_columns = {}

for table in TABLES:
    pg_cur.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema='public'
        AND table_name=%s
    """, (table,))
    pg_columns[table] = {r[0] for r in pg_cur.fetchall()}

# -----------------------------
# MIGRATION
# -----------------------------
for table in TABLES:

    print(f"\nMigrating {table}...")

    sqlite_cur.execute(f'SELECT * FROM "{table}"')
    rows = sqlite_cur.fetchall()

    count = 0

    for row in rows:

        cols = []
        vals = []

        for c in row.keys():

            # Skip columns missing in PostgreSQL
            if c not in pg_columns[table]:
                continue

            value = row[c]

            # Convert timestamps
            if c in ("createdAt", "updatedAt") and isinstance(value, int):
                value = datetime.fromtimestamp(value / 1000)

            if c == "expires" and isinstance(value, int):
                value = datetime.fromtimestamp(value / 1000)

            cols.append(c)
            vals.append(value)

        if not cols:
            continue

        sql = f'''
        INSERT INTO "{table}"
        ({",".join(f'"{c}"' for c in cols)})
        VALUES
        ({",".join(["%s"] * len(vals))})
        ON CONFLICT DO NOTHING;
        '''

        try:
            pg_cur.execute(sql, vals)
            count += 1
        except Exception as e:
            print(f"Skipping row in {table}: {e}")
            pg_conn.rollback()
            continue

    pg_conn.commit()
    print(f"{table}: {count} rows processed")

# -----------------------------
# DONE
# -----------------------------
sqlite_cur.close()
sqlite_conn.close()

pg_cur.close()
pg_conn.close()

print("\n===================================")
print("Migration completed successfully.")
print("===================================")

import psycopg2
from config import HOST,PORT,DATABASE,USER,PASSWORD

try:
    conn = psycopg2.connect(
        host=HOST,
        port=PORT,
        database=DATABASE,
        user=USER,
        password=PASSWORD
    )
    cursor = conn.cursor()
    conn.commit()
    print("✅ PostgreSQL connection established")
except Exception as e:
    print("❌ Failed to connect to DB", e)
    conn = None
    cursor = None
import asyncpg
from fastapi import HTTPException, status
from app.core.config import settings

# Global Variable untuk Pool
db_pool: asyncpg.Pool | None = None

async def create_db_pool():
    """Jalankan saat server start"""
    global db_pool
    print(f"🚀 Connecting to Database...")
    try:
        db_pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            min_size=1,
            max_size=10,
            command_timeout=60
        )
        print("✅ DB Connected.")
    except Exception as e:
        print(f"❌ DB Connection Error: {e}")
        raise e
    
async def close_db_pool():
    """Jalankan saat server stop"""
    global db_pool
    if db_pool:
        await db_pool.close()
        print("🛑 DB Disconnected.")

async def get_db():
    """Dependency Injection untuk Endpoint"""
    if db_pool is None:
        raise HTTPException(status_code=503, detail="DB not initialized")
    return db_pool

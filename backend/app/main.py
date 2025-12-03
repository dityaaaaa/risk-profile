from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import settings
from app.core.db import create_db_pool, close_db_pool
from app.api import auth, users

# --- LIFESPAN (Connection Management) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Buat koneksi database
    await create_db_pool()
    yield
    # Shutdown: Tutup koneksi
    await close_db_pool()

# --- INITIALIZE APP ---
app = FastAPI(
    title="FastAPI Modular Auth",
    version="1.0.0",
    lifespan=lifespan
)

# --- REGISTER ROUTER ---
app.include_router(auth.router)
app.include_router(users.router)

# --- ROOT ENDPOINT (Optional) ---
@app.get("/")
def read_root():
    return {"message": "Server is running!", "docs": "/docs"}

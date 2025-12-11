from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import create_db_pool, close_db_pool
from app.api import auth, users, assessment

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

# --- KONFIGURASI CORS ---
# Tentukan domain mana saja yang boleh mengakses API ini
origins = [
    "*"
    "http://localhost",
    "http://localhost:3000", # React / Next.js default
    "http://localhost:5173", # Vite / Vue default
    "http://localhost:8080",
    # "*", # Gunakan bintang (*) jika ingin membolehkan semua (tidak aman untuk produksi)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   
    allow_credentials=True,  
    allow_methods=["*"],     
    allow_headers=["*"],     
)

# --- REGISTER ROUTER ---
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(assessment.router)

# Import master_data router
from app.api import master_data
app.include_router(master_data.router)

# --- ROOT ENDPOINT (Optional) ---
@app.get("/")
def read_root():
    return {"message": "Server is running!", "docs": "/docs"}

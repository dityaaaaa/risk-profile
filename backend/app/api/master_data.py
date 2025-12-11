from typing import Annotated, List
from fastapi import APIRouter, Depends
import asyncpg

from app.core.db import get_db

router = APIRouter(prefix="/master", tags=["Master Data"])

# --- 1. GET RISK TYPES ---
@router.get("/risk-types")
async def get_risk_types(
    unit_type: str,  # 'LPEI' or 'UUS'
    pool: Annotated[asyncpg.Pool, Depends(get_db)]
):
    """Get all risk types for specific unit type"""
    if unit_type == "UUS":
        rows = await pool.fetch("""
            SELECT id, name, weight_uus as weight, is_uus 
            FROM risk_types 
            WHERE is_uus = TRUE 
            ORDER BY id
        """)
    else:
        rows = await pool.fetch("""
            SELECT id, name, weight_lpei as weight, is_lpei 
            FROM risk_types 
            WHERE is_lpei = TRUE 
            ORDER BY id
        """)
    
    return [dict(row) for row in rows]

# --- 2. GET PERIODS ---
@router.get("/periods")
async def get_periods(
    pool: Annotated[asyncpg.Pool, Depends(get_db)]
):
    """Get all available periods"""
    rows = await pool.fetch("""
        SELECT id, name, year, quarter, start_date, end_date 
        FROM periods 
        ORDER BY year DESC, quarter DESC
    """)
    
    return [dict(row) for row in rows]

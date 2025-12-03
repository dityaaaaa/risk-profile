from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg

from app.core.db import get_db
from app.core.security import get_password_hash
from app.schemas.user import UserResponse, UserCreate, UserUpdate
from app.repository.user_repo import UserRepository
from app.api.deps import get_current_superuser

router = APIRouter(prefix="/users", tags=["Users Management"])

# --- 1. LIHAT SEMUA USER ---
@router.get("/", response_model=List[UserResponse])
async def read_users(
    pool: Annotated[asyncpg.Pool, Depends(get_db)],
    admin: dict = Depends(get_current_superuser)
):
    return await UserRepository.get_all(pool)

# --- 2. LIHAT 1 USER ---
@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    pool: Annotated[asyncpg.Pool, Depends(get_db)],
    admin: dict = Depends(get_current_superuser)
):
    user = await UserRepository.get_by_id(pool, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# --- 3. CREATE USER (Admin) --- 
@router.post("/", response_model=UserResponse)
async def create_user(
    user_in: UserCreate,
    pool: Annotated[asyncpg.Pool, Depends(get_db)],
    admin: dict = Depends(get_current_superuser)
):
    if await UserRepository.get_by_email(pool, user_in.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_in.password)
    new_user = await UserRepository.create(pool, user_in, hashed_pw)
    return new_user

# --- 4. EDIT USER ---
@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_in: UserCreate,
    pool: Annotated[asyncpg.Pool, Depends(get_db)],
    admin: dict = Depends(get_current_superuser)
):
    if not await UserRepository.get_by_id(pool, user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return await UserRepository.update(pool, user_id, user_in)

# --- 5. DELETE USER ----
@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    pool: Annotated[asyncpg.Pool, Depends(get_db)],
    admin: dict = Depends(get_current_superuser)
):
    # Mencegah admin menghapus dirinya sendiri
    if user_id == admin['id']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete yourself")
    result = await pool.execute("DELETE FROM users WHERE id = $1", user_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"message": "User deleted successfully"} 
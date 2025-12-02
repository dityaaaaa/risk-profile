from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import InvalidTokenError
import asyncpg

from app.core.db import get_db
from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    oauth2_scheme
)
from app.schemas.user import UserRegister, UserResponse, Token
from app.repository.user_repo import UserRepository

# Setup Router
router = APIRouter(prefix="/auth", tags=["Auth"])

# --- DEPENDENCY: Get current user ---
# Fungsi ini dipasang di setiap endpoint yang butuh proteksi
async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    pool: Annotated[asyncpg.Pool, Depends(get_db)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode Token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    
    # Cek ke Database via Repository
    user = await UserRepository.get_by_email(pool, email)
    if user is None:
        raise credentials_exception
    
    return user

# --- ENDPOINT 1: REGISTER ---
@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserRegister,
    pool: Annotated[asyncpg.Pool, Depends(get_db)]
):
    # 1. Cek apakah email sudah ada?
    existing_user = await UserRepository.get_by_email(pool, user_data.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # 2. Hash password
    hashed_pw = get_password_hash(user_data.password)

    # 3. Simpan ke DB
    new_user = await UserRepository.create(pool, user_data, hashed_pw)

    if new_user is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user")
    
    return new_user

# --- ENDPOINT 2: LOGIN ---
@router.post("/token", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    pool: Annotated[asyncpg.Pool, Depends(get_db)]
):
    # Catatan: form_data.username berisi EMAIL (bawaan OAuth2)

    # 1. Ambil user dari DB
    user = await UserRepository.get_by_email(pool, form_data.username)

    # 2. Verifikasi Password
    if not user or not verify_password(form_data.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Buat Token Akses
    access_token = create_access_token(data={"sub": user["email"]})

    return {"access_token": access_token, "token_type": "bearer"}

# --- ENDPOINT 3: CEK USER SENDIRI (PROTECTED) ---
@router.get("/me", response_model=UserResponse)
async def read_user_me(
    current_user: Annotated[dict, Depends(get_current_user)]
):
    return current_user
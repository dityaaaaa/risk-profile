import asyncpg
from typing import List, Optional, Union
from app.schemas.user import UserRegister, UserCreate, UserUpdate, UserRole

class UserRepository:
    @staticmethod
    async def get_all(pool: asyncpg.Pool) -> List[dict]:
        query = "SELECT id, email, full_name, role, created_at FROM users ORDER BY id ASC"
        rows = await pool.fetch(query)
        return [dict(row) for row in rows]
    
    @staticmethod
    async def get_by_id(pool: asyncpg.Pool, user_id: int) -> Optional[dict]:
        query = "SELECT id, email, full_name, role, created_at FROM users WHERE id = $1"
        row = await pool.fetchrow(query, user_id)
        return dict(row) if row else None

    @staticmethod
    async def get_by_email(pool: asyncpg.Pool, email: str) -> Optional[dict]:
        query = "SELECT * FROM users WHERE email = $1"
        row = await pool.fetchrow(query, email)
        return dict(row) if row else None

    @staticmethod
    async def create(pool: asyncpg.Pool, user: Union[UserRegister, UserCreate], hashed_password: str) -> Optional[dict]:
        role_to_save = getattr(user, "role", UserRole.USER)
        
        query = """
            INSERT INTO users (email, password, full_name, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, full_name, role, created_at
        """

        try:
            row = await pool.fetchrow(query, user.email, hashed_password, user.full_name, role_to_save)
            return dict(row)
        except asyncpg.UniqueViolationError:
            return None
    
    @staticmethod
    async def update(pool: asyncpg.Pool, user_id: int, user: UserUpdate) -> Optional[dict]:
        fields = []
        values = []
        idx = 1

        if user.full_name is not None:
            fields.append(f"full_name = ${idx}")
            values.append(user.full_name)
            idx += 1
        if user.email is not None:
            fields.append(f"email = ${idx}")
            values.append(user.email)
            idx += 1
        if user.role is not None:
            fields.append(f"role = ${idx}")
            values.append(user.role)
            idx += 1
        
        if not fields:
            return await UserRepository.get_by_id(pool, user_id)

        values.append(user_id)
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = ${idx} RETURNING id, email, full_name, role, created_at"

        row = await pool.fetchrow(query, *values)
        return dict(row) if row else None
    
    @staticmethod
    async def delete(pool: asyncpg.Pool, user_id: int) -> bool:
        result = await pool.execute("DELETE FROM users WHERE id = $1", user_id)
        return result != "DELETE 0"

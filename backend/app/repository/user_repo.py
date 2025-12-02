import asyncpg
from app.schemas.user import UserRegister

class UserRepository:
    @staticmethod
    async def create(pool: asyncpg.Pool, user: UserRegister, hashed_password: str):
        query = """
            INSERT INTO users (email, password, full_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, full_name, role, created_at
        """

        try:
            row = await pool.fetchrow(query, user.email, hashed_password, user.full_name)
            return dict(row)
        except asyncpg.UniqueViolationError:
            return None
        
    @staticmethod
    async def get_by_email(pool: asyncpg.Pool, email: str):
        query = "SELECT * FROM users WHERE email = $1"
        row = await pool.fetchrow(query, email)
        return dict(row) if row else None
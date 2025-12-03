from enum import Enum
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ERM = "erm"
    USER = "user"

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: str
    role: UserRole = UserRole.USER

class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    role: UserRole | None = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    role: UserRole
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
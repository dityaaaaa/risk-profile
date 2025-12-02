from datetime import datetime
from pydantic import BaseModel, EmailStr

# Input saat Register
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: str

# Output Data User (tanpa password)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    role: str
    created_at: datetime

# Output Token
class Token(BaseModel):
    access_token: str
    token_type: str
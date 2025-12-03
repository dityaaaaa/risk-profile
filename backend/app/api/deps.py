from typing import Annotated
from fastapi import Depends, HTTPException, status
from app.api.auth import get_current_user
from app.schemas.user import UserRole

# Dependency: Wajib Super Admin
async def get_current_superuser(
    current_user: Annotated[dict, Depends(get_current_user)]
) -> dict:
    # Cek apakah role adalah 'super_admin'
    if current_user['role'] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges. Super Admin required."
        )
    return current_user

# Dependency: Wajib Admin ERM (atau super admin juga boleh akses)
async def get_current_admin_erm(
    current_user: Annotated[dict, Depends(get_current_user)]
) -> dict:
    # ERM atau Super Admin boleh akses
    if current_user['role'] not in [UserRole.ERM, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges. Admin ERM required."
        )
    return current_user
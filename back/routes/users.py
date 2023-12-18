# ===============================================================
#   Imports
# ===============================================================

import database.database as db
import utils.schemas as sh
from utils.login_function import *
from fastapi import status, APIRouter
from database.database import Table

# ===============================================================
#   Routes
# ===============================================================

router = APIRouter()

@router.get("/current_user", tags=["Users"])
def get_current_user(account=Depends(manager)):
    result = account.__dict__
    result.pop("password") # Remove password for security
    return result

@router.get("/users", tags=["Users"])
def get_users(account=Depends(is_admin)):
    return Table(db.Users).get_rows()


@router.get("/users/{id}", tags=["Users"])
def get_by_id_user(id: PositiveInt, account=Depends(is_admin)):
    return Table(db.Users).get_row("id",id)


@router.post("/users", tags=["Users"], status_code=status.HTTP_201_CREATED)
def create_user(user: sh.UserCreateAdmin, account=Depends(is_admin)):
    return Table(db.Users).add_row(user.model_dump(exclude_none=True))


@router.put("/users/{id}", tags=["Users"])
def update_user(id: PositiveInt, user: sh.UserUpdate, account=Depends(manager)):
    with Table(db.Users) as t:
        if account.id == t.get_row('id',id)["data"].id or account.admin:
            return t.update_row(user.model_dump(exclude_none=True),id)
        else :
            return {"Success":False,"data":"The user is not the same"}

@router.delete("/users/{id}", tags=["Users"])
def delete_user(id: PositiveInt, account=Depends(is_admin)):
    return Table(db.Users).delete_row(id)

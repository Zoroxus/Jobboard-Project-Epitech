# ===============================================================
#   Imports
# ===============================================================

import database.database as db
import utils.schemas as sh 
from utils.login_function import *
from fastapi import status,APIRouter
from hashlib import sha256

# ===============================================================
#   Routes
# ===============================================================

router  = APIRouter()

@router.post("/signup", tags=["Login"], status_code=status.HTTP_201_CREATED)
def signup(user: sh.UserCreate):
    user.password = sha256(user.password.encode()).hexdigest() # Hash password in sha256
    result = Table(db.Users).add_row(user.model_dump())
    if result['Success'] == False:
        return result
    access_token = manager.create_access_token(
        data={'sub': user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", tags=["Login"])
def login(data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    password = sha256(data.password.encode()).hexdigest()
    user = load_user(email)
    if not user or type(user) == str:
        # you can return any response or error of your choice
        raise InvalidCredentialsException
    elif password != user.password:
        raise InvalidCredentialsException

    access_token = manager.create_access_token(
        data={'sub': email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.put("/change_password", tags=["Login"])
def change_password(user: sh.UserChangePassword, account=Depends(manager)):
    id = account.id if user.id == None else user.id
    with Table(db.Users) as t:
        if account.id == t.get_row('id',id)["data"].id or account.admin:
            if account.admin or account.password == sha256(user.old_password.encode()).hexdigest():
                user.new_password = sha256(user.new_password.encode()).hexdigest() # Hash password in sha256
                return t.update_row({'password':user.new_password},id)
            else:
                return {"Success":False,"data":"The password is not the same"}
        else :
            return {"Success":False,"data":"The user is not the same"}
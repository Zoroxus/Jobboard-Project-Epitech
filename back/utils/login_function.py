# ===============================================================
#   Imports
# ===============================================================
from fastapi_login import LoginManager
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi import Depends,HTTPException
from pydantic import EmailStr, PositiveInt
import database.database as db
from database.database import Table
import utils.schemas as sh 

# TODO remove this token
SECRET="f16a805f275933b8275f4d61a2bb75ce41fdd2e3059aa30e"

# ! Attention il faut mettre le chemin complet
manager = LoginManager(SECRET, '/api/login')

# ===============================================================
#   Login functions
# ===============================================================

@manager.user_loader()
def load_user(email: EmailStr):
    # TODO ajouter la vérif
    return Table(db.Users).get_row("email",email)['data']

def is_admin(user: sh.User = Depends(manager)):
    if user.admin:
        return user
    raise HTTPException(status_code=401, detail="The user is not an administrator")

def user_companie(user: sh.User = Depends(manager)):
    if user.admin or user.companies_id != None:
        return user
    raise HTTPException(status_code=401, detail="The user is not part of a company")
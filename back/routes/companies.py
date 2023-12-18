# ===============================================================
#   Imports
# ===============================================================

import database.database as db
from database.database import Table
import utils.schemas as sh
from utils.login_function import *
from fastapi import status, APIRouter
from routes.users import get_by_id_user

# ===============================================================
#   Routes
# ===============================================================

router = APIRouter()


@router.get("/companies", tags=["Companies"])
def get_companies():
    return Table(db.Companies).get_rows()


@router.get("/companies/{id}", tags=["Companies"])
def get_by_id_companies(id: PositiveInt):
    return Table(db.Companies).get_row("id",id)


@router.get("/companies_by_ad/{user_id}", tags=["Companies"])
def get_companies_by_ad(user_id: PositiveInt):
    with Table(db.Users) as r:
        result = r.get_row("id",user_id)
        if result['Success']:
            return {"Succes": True, "data": result["data"].companies}
        else:
            return {"Succes": False, "data": result["data"]}


@router.post("/companies", tags=["Companies"], status_code=status.HTTP_201_CREATED)
def create_companies(companie: sh.CompaniesCreate):
    # TODO a voir comment gérer la sécurisation
    return Table(db.Companies).add_row(companie.model_dump(exclude_none=True))


@router.put("/companies/{id}", tags=["Companies"])
def update_companies(id: PositiveInt, companie: sh.CompaniesUpdate, account=Depends(user_companie)):
    # TODO ajouter la vérif user
    return Table(db.Companies).update_row(companie.model_dump(exclude_none=True),id)


@router.delete("/companies/{id}", tags=["Companies"])
def delete_companies(id: PositiveInt, account=Depends(is_admin)):
    return Table(db.Companies).delete_row(id)

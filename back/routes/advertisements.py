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


@router.get("/advertisements", tags=["Advertisements"])
def get_job_advertisements():
    return Table(db.Advertisements).get_rows()


@router.get("/advertisements/{id}", tags=["Advertisements"])
def get_by_id_job_advertisements(id: PositiveInt):
    return Table(db.Advertisements).get_row("id",id)


@router.post("/advertisements", tags=["Advertisements"],status_code=status.HTTP_201_CREATED)
def create_job_advertisements(ad: sh.AdvertisementCreate, account=Depends(user_companie)):
    content = ad.model_dump(exclude_none=True)
    if (content['users_id'] == None):
        content['users_id'] = account.id
    return Table(db.Advertisements).add_row(content)


@router.put("/advertisements/{id}", tags=["Advertisements"])
def update_job_advertisements(id: PositiveInt, ad: sh.AdvertisementUpdate, account=Depends(user_companie)):
    if account.admin == True or account.id == ad.users_id:
        return Table(db.Advertisements).update_row(ad.model_dump(exclude_none=True), id)
    else:
        raise HTTPException(401,"The user is not the same of user_id")


@router.delete("/advertisements/{id}", tags=["Advertisements"])
def delete_by_id_job_advertisements(id: PositiveInt, account=Depends(user_companie)):
    with Table(db.Advertisements) as t:
        result = t.get_row("id",id)
        if t.get_row("id",id)['data'].users_id == account.id or account.admin:
            return t.delete_row(id)
        else:
            return {"Success":False,"data":"The advertisement does not belong to the user"}

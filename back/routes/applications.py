# ===============================================================
#   Imports
# ===============================================================

import database.database as db
from database.database import Table
import utils.schemas as sh
from utils.login_function import *
from fastapi import status, APIRouter

# ===============================================================
#   Routes
# ===============================================================

router = APIRouter()


@router.get("/applications", tags=["Applications"])
def get_job_applications():
    return Table(db.Applications).get_rows()


@router.get("/applications/{id}", tags=["Applications"])
def get_by_id_job_application(id: PositiveInt):
    return Table(db.Applications).get_row("id",id)


@router.post("/applications", tags=["Applications"], status_code=status.HTTP_201_CREATED)
def create_job_application(app: sh.ApplicationCreate, account=Depends(manager)):
    return Table(db.Applications).add_row(app.model_dump(exclude_none=True))


@router.put("/applications/{id}", tags=["Applications"])
def update_job_application(id: PositiveInt, app: sh.ApplicationUpdate, account=Depends(is_admin)):
    return Table(db.Applications).update_row(app.model_dump(exclude_none=True),id)


@router.delete("/applications/{id}", tags=["Applications"])
def delete_job_application(id: PositiveInt, account=Depends(is_admin)):
    return Table(db.Applications).delete_row(id)

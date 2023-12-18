#!/usr/bin/env python3
# ===============================================================
#   Imports
# ===============================================================

from fastapi import FastAPI,Depends
import uvicorn
from fastapi.responses import RedirectResponse
from routes import users,applications,companies,login,advertisements
from sqlalchemy import MetaData
import database.database as db
from utils.login_function import *

# ===============================================================
#   Docs
# ===============================================================

description = """
This API is intended to be used to interact with a database and the end user. It will be used in the case of a JobBoard.
"""

tags_metadata = [
    {
        "name": "Login",
        "description": "Manage **Login** and token.",
    },
    {
        "name": "Advertisements",
        "description": "Manage Jobs",
    },
    {
        "name": "Applications",
        "description": "Manage applications data",
    },
    {
        "name": "Companies",
        "description": "Manage companies",
    },
    {
        "name": "Users",
        "description": "Operations with users.",
    },    
]

# Create App with description and tags
app = FastAPI(
    root_path="/api/",
    title="JobBoard API",
    description=description,
    version="0.1",
    contact={
        "name": "Florian Brisset, Maxime Pouleyn",
    },
    openapi_tags=tags_metadata
)

# Include routes
app.include_router(users.router)
app.include_router(applications.router)
app.include_router(companies.router)
app.include_router(login.router)
app.include_router(advertisements.router)

# ===============================================================
#   Routes
# ===============================================================


@app.get("/", include_in_schema=False)
async def root():
    """API description and version

    :return dict: API version
    """
    return {"api": {"version": 1}}

@app.get("/roll", include_in_schema=False)
async def roll():
    """Faut bien rigoler dans la vie

    :return RedirectResponse: Clique est tu verras
    """
    return RedirectResponse("https://www.youtube.com/watch?v=dQw4w9WgXcQ?autoplay=1")

@app.get("/arch",include_in_schema=False)
def arch(account=Depends(is_admin)): # ! account=Depends(is_admin)
    metadata = MetaData()
    metadata.reflect(bind=db.engine)
    result = {}
    for table_name, table in metadata.tables.items():
        columns = []
        for column in table.c:
            columns.append(column.name)
        result[table_name] = columns
    return result

# ===============================================================
#   Main
# ===============================================================


if __name__ == "__main__":
    # Launch the Uvicorn server and reload each time you save
    uvicorn.run("main:app", port=5000, log_level="info", reload=True)

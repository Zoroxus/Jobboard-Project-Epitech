#!/usr/bin/env python3
# ===============================================================
#   Imports
# ===============================================================

from pydantic import BaseModel, EmailStr, PositiveInt
from typing import Optional
from datetime import datetime
from datetime import date

# TODO changer les nom pr qu'ils correspondent au models

# ===============================================================
#   Models
# ===============================================================

# =============================
#   Companies
# =============================

class CompaniesBase(BaseModel):
    name: str


class CompaniesCreate(CompaniesBase):
    pass


class CompaniesUpdate(BaseModel):
    name: Optional[str] = None


class Companies(CompaniesBase):
    id: PositiveInt

# =============================
#   Users
# =============================


class UserBase(BaseModel):
    email: EmailStr
    password: str


class UserCreate(UserBase):
    firstname: str
    name: str
    birthdate: date
    phone: str
    adress: str

class UserCreateAdmin(UserCreate):
    admin: Optional[bool] = False

class UserUpdate(BaseModel): 
    email: Optional[EmailStr] = None
    admin: Optional[bool] = None
    companies_id: Optional[PositiveInt]
    firstname: Optional[str] = None
    name: Optional[str] = None
    birthdate: Optional[date] = None
    phone: Optional[str] = None
    adress: Optional[str] = None

class UserChangePassword(BaseModel):
    old_password: Optional[str] = None
    new_password: str
    id : Optional[PositiveInt] = None

class User(UserCreate):
    id: PositiveInt
    admin: Optional[bool] = False
    companies_id: PositiveInt

# =============================
#   Advertisements
# =============================


class AdvertisementBase(BaseModel):
    name: str
    short_descriptions : str
    descriptions: str
    wages : PositiveInt
    location : str
    worktime : str


class AdvertisementCreate(AdvertisementBase):
    users_id: Optional[PositiveInt] = None


class AdvertisementUpdate(BaseModel):
    users_id: Optional[PositiveInt] = None
    name:  Optional[str] = None
    short_descriptions : str
    descriptions:  Optional[str] = None
    wages : Optional[PositiveInt] = None
    location : Optional[str] = None
    worktime : Optional[str] = None


class Advertisement(AdvertisementBase):
    id: PositiveInt
    users_id: PositiveInt
    user: User
    creation_time: datetime

# =============================
#   Application
# =============================


class ApplicationBase(BaseModel):
    message: str
    users_id: PositiveInt
    advertisements_id: PositiveInt


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    message: Optional[str] = None
    users_id: Optional[PositiveInt] = None
    advertisements_id: Optional[PositiveInt] = None


class Application(ApplicationBase):
    id: PositiveInt
    creation_time: datetime
    user: User
    advertisement: Advertisement
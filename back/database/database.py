#!/usr/bin/env python3
# ===============================================================
#   Imports
# ===============================================================

from sqlalchemy import create_engine,MetaData
from sqlalchemy.orm import relationship
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from database.settings import *
from database.models import *
import logging

# ===============================================================
#   Engine
# ===============================================================

# Creation du connecteur a la bdd
engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{database}')

# ===============================================================
#   Tables
# ===============================================================

Users.companies = relationship("Companies")
Advertisements.users = relationship("Users")
Applications.advertisements = relationship("Advertisements")

# ===============================================================
#   Class
# ===============================================================

class Table():
    def __init__(self,table : Base):
        self.__table = table
        self.__session = sessionmaker(bind=engine)()
    
    def __del__(self):
        self.session.close()
    
    @property
    def tablename(self):
        return self.__table.__tablename__
    
    @property
    def session(self):
        return self.__session
    
    @property
    def table(self):
        return self.__table

    def get_rows(self):
        try:
            result = self.session.query(self.table).all()
            if result == None:
                result = {"Success":False,"data":f"{self.table.__name__} is not found"}
            else:
                result = {"Success":True,"data":result}
        except SQLAlchemyError as e:
            result = {"Success":False,"data":f"{e}"}
        return result
    
    def get_row(self,champ:str,content):
        try:
            result = self.session.query(self.table).filter(getattr(self.table,champ) == content).first()
            if result == None:
                result = {"Success":False,"data":f"{self.table.__name__} is not found by id : {content}"}
            else:
                result = {"Success":True,"data":result}
        except SQLAlchemyError as e:
            result = {"Success":False,"data":f"{e}"}
        except AttributeError as e:
            result = {"Success":False,"data":f"{e}"}
        return result

    def delete_row(self,id:int):
        try:
            self.session.delete(self.session.query(self.table).filter(self.table.id == id).first())
            self.session.commit()
            result = {"Success":True,"data":f"{self.table.__tablename__} with {id} is deleted"}
        except SQLAlchemyError as e:
            result = {"Success":False,"data":f"{e}"}
        return result

    def update_row(self,content:dict,id:int):
        try:
            if content == {}:
                result = {"Success":False,"data":"No value given"}
            else:
                maj_table = self.session.query(self.table).filter_by(id=id)
                maj_table.update(content)
                self.session.commit()
                result = {"Success":True,"data":f"{self.table.__tablename__} with {id} is updated"}
        except SQLAlchemyError as e:
            result = {"Success":False,"data":f"{e}"}
        return result

    def add_row(self,content:dict):
        try:
            self.session.add(self.table(**content))
            self.session.commit()
            result = {"Success":True,"data":f"{self.table.__tablename__} is added"}
        except SQLAlchemyError as e:
            result = {"Success":False,"data":f"{e}"}
        return result
    
    def __enter__(self):
        return self
    
    def __exit__(self,*args):
        self.session.close()
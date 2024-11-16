import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from sqlalchemy import UUID, Column, DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Fruits(Base):
    __tablename__ = "fruits"

    id = Column("id", Integer, primary_key=True)
    name = Column("name", String(10))
    price = Column("price", Integer)


class SelectFruits(Base):
    __tablename__ = "select_fruits"

    id = Column("id", Integer, primary_key=True)
    name = Column("name", String(10))
    price = Column("price", Integer)
    user_id = Column("user_id", UUID)

    def __init__(self, id: int, name: str, price: int, user_id: uuid.UUID):
        self.id = id
        self.name = name
        self.price = price
        self.user_id = user_id


class Setup(Base):
    __tablename__ = "allow_users"

    id = Column("id", Integer, primary_key=True, index=True)
    username = Column("username", String, unique=True, index=True)


class Users(Base):
    __tablename__ = "login_users"

    id = Column("id", Integer, primary_key=True, index=True)
    login_time = Column("login_time", DateTime, default=datetime.now())
    username = Column("username", String, unique=True, index=True)
    password = Column("password", String, unique=True, index=True)


class Login(Base):
    __tablename__ = "login"

    id = Column("id", Integer, primary_key=True, index=True)
    login_time = Column("login_time", DateTime, default=datetime.now())
    username = Column("username", String, unique=True, index=True)


class UserSetup(BaseModel):
    username: str


class UserCreate(BaseModel):
    username: str
    password: str


class LoginUsers(BaseModel):
    username: str
    password: str


class ItemSchema(BaseModel):
    id: int
    name: str
    price: int

    model_config = ConfigDict(from_attributes=True)

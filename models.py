from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Fruits(Base):
    __tablename__ = "fruits"

    id = Column("id", Integer, primary_key=True)
    name = Column("name", String(10))
    price = Column("price", Integer)


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

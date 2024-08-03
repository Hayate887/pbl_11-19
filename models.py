from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "fruits"

    id = Column("id", Integer, primary_key=True)
    name = Column("name", String(10))
    price = Column(Integer)

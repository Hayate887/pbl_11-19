from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import models

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://user:postgres@localhost:5432/postgres"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
session = Session(autocommit=False, autoflush=True, bind=engine)


def read_fruits():
    return session.query(models.User).all()


def add_fruits(id: int, name: str, price: int):
    user_obj = models.User(id=id, name=name, price=price)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj




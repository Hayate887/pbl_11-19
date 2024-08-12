from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import models

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://user:postgres@localhost:5432/postgres"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
session = Session(autocommit=False, autoflush=True, bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def read_fruits():
    return session.query(models.Fruits).all()


def add_fruits(id: int, name: str, price: int):
    user_obj = models.Fruits(id=id, name=name, price=price)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj


def setup(user: models.UserSetup):
    if user.username == "":
        raise HTTPException(status_code=401, detail="ユーザー名を入力してください")

    user_obj = models.Setup(username=user.username)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj


def add_users(user: models.UserCreate):
    set_user_name = (
        session.query(models.Setup)
        .filter(user.username == models.Setup.username)
        .first()
    )
    db_user_name = session.query(models.Users).first()

    if user.username == "" or user.password == "":
        raise HTTPException(
            status_code=401, detail="ユーザー名またはパスワードを入力してください"
        )

    if set_user_name is None:
        raise HTTPException(status_code=401, detail="ユーザー名に誤りがあります")

    if db_user_name is None:
        pass
    elif pwd_context.verify(user.username, db_user_name.username):
        raise HTTPException(status_code=401, detail="ユーザー名はすでに存在します")

    hash_username = pwd_context.hash(user.username)
    hash_password = pwd_context.hash(user.password)
    user_obj = models.Users(username=hash_username, password=hash_password)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj


def read_users(user: models.LoginUsers):
    db_user_id = session.query(models.Users).first()

    if user.username == "" or user.password == "":
        raise HTTPException(
            status_code=401, detail="ユーザー名またはパスワードを入力してください"
        )

    if not pwd_context.verify(
        user.username, db_user_id.username
    ) or not pwd_context.verify(user.password, db_user_id.password):
        raise HTTPException(status_code=401, detail="失敗しました")

    hash_username = pwd_context.hash(user.username)
    user_obj = models.Login(username=hash_username)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return {"message": "ログイン成功"}, user_obj

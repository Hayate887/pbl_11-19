from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://user:postgres@localhost:5432/postgres"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def read_fruits(session: Session):
    return session.query(models.Fruits).all()


def read_select_fruits(session: Session, user_id: str):
    users = (
        session.query(models.SelectFruits)
        .filter(models.SelectFruits.user_id == user_id)
        .order_by(models.SelectFruits.id)
        .all()
    )
    return users


def add_fruits(id: int, name: str, price: int, session: Session):
    user_obj = models.Fruits(id=id, name=name, price=price)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj


def delete_fruits(id: int, session: Session):
    user_obj = session.query(models.Fruits).filter(models.Fruits.id == id).first()
    if user_obj:
        session.delete(user_obj)
        session.commit()
        return user_obj
    else:
        return None


def add_select_fruits(id: int, name: str, price: int, user_id: str, session: Session):
    user_obj = models.SelectFruits(id=id, name=name, price=price, user_id=user_id)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj


def delete_select_fruits(id: int, user_id: str, session: Session):
    user_obj = (
        session.query(models.SelectFruits)
        .filter(models.SelectFruits.user_id == user_id, models.SelectFruits.id == id)
        .first()
    )
    if user_obj:
        session.delete(user_obj)
        session.commit()
        return user_obj
    else:
        return None


def setup(user: models.UserSetup, session: Session):
    if user.username == "":
        raise HTTPException(status_code=401, detail="ユーザー名を入力してください")

    user_obj = models.Setup(username=user.username)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return user_obj


def add_users(user: models.UserCreate, session: Session):
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
    elif (
        session.query(models.Users)
        .filter(user.username == models.Users.username)
        .first()
    ):
        raise HTTPException(status_code=401, detail="ユーザー名はすでに存在します")

    hash_password = pwd_context.hash(user.password)

    user_obj = models.Users(username=user.username, password=hash_password)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)

    return user_obj


def read_users(user: models.LoginUsers, session: Session):
    db_user_name = (
        session.query(models.Users)
        .filter(user.username == models.Users.username)
        .first()
    )

    if user.username == "" or user.password == "":
        raise HTTPException(
            status_code=401, detail="ユーザー名またはパスワードを入力してください"
        )

    if not db_user_name or not pwd_context.verify(user.password, db_user_name.password):
        raise HTTPException(status_code=401, detail="失敗しました")

    hash_username = pwd_context.hash(user.username)
    user_obj = models.Login(username=hash_username)
    session.add(user_obj)
    session.commit()
    session.refresh(user_obj)
    return {"message": "ログイン成功"}, user_obj

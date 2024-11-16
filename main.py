import os
from typing import Union
from uuid import UUID

import jwt
from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidAudienceError, InvalidTokenError
from sqlalchemy.orm import Session

import models
from database import (
    add_fruits,
    add_select_fruits,
    add_users,
    delete_fruits,
    delete_select_fruits,
    get_db,
    read_fruits,
    read_select_fruits,
    read_users,
    setup,
)

app = FastAPI()
load_dotenv()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SECRET_KEY = os.getenv("SECRET_KEY")


async def get_auth_user_id(
    authorization: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    token = authorization.credentials
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            audience="authenticated",
            algorithms=["HS256"],
        )
        return payload.get("sub")
    except InvalidAudienceError:
        print("invalid audience")
    except InvalidTokenError as e:
        raise HTTPException(status_code=403, detail=f"Invalid token: {str(e)}")


@app.get("/")
def read_root():
    return {"Hello": "World!!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


# 追記部分
@app.get("/users")
def get_users(session: Session = Depends(get_db)):
    return read_fruits(session)


@app.get("/select/users")
def get_select_users(
    session: Session = Depends(get_db), user_id: UUID = Depends(get_auth_user_id)
):
    return read_select_fruits(session, user_id)


@app.post("/select/fruits")
async def post_item(
    id: int = Body(...),
    name: str = Body(...),
    price: int = Body(...),
    session: Session = Depends(get_db),
    user_id: UUID = Depends(get_auth_user_id),
) -> models.ItemSchema:
    i = models.SelectFruits(id, name, price, user_id)
    add_select_fruits(id, name, price, user_id, session)
    return models.ItemSchema.model_validate(i)


@app.delete("/select/delete/{id}")
def select_delete_users(
    id: int,
    user_id: UUID = Depends(get_auth_user_id),
    session: Session = Depends(get_db),
):
    fruits_obj = delete_select_fruits(id, user_id, session)
    return fruits_obj


@app.post("/fruits")
def create_users(
    id: int = Body(...),
    name: str = Body(...),
    price: int = Body(...),
    session: Session = Depends(get_db),
):
    fruits_obj = add_fruits(id, name, price, session)
    return {"id": fruits_obj.id, "name": fruits_obj.name, "price": fruits_obj.price}


@app.delete("/delete/{id}")
def delete_users(
    id: int,
    session: Session = Depends(get_db),
):
    fruits_obj = delete_fruits(id, session)
    return fruits_obj


"""自己紹介サイト"""


@app.post("/setting")
def set_up(user: models.UserSetup, session: Session = Depends(get_db)):
    set_up_obj = setup(user, session)
    return set_up_obj


@app.post("/creates")
def sign_up(user: models.UserCreate, session: Session = Depends(get_db)):
    sign_up_obj = add_users(user, session)
    return sign_up_obj


@app.post("/login")
def sign_in(user: models.UserCreate, session: Session = Depends(get_db)):
    sign_in_obj = read_users(user, session)
    return sign_in_obj

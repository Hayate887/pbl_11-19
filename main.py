from typing import Union

from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import (
    add_fruits,
    add_users,
    read_fruits,
    read_users,
    setup,
)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World!!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


# 追記部分
@app.get("/users")
def get_users():
    return read_fruits()


@app.post("/fruits")
def create_users(id: int = Body(...), name: str = Body(...), price: int = Body(...)):
    fruits_obj = add_fruits(id, name, price)
    return {"id": fruits_obj.id, "name": fruits_obj.name, "price": fruits_obj.price}


@app.post("/setting")
def set_up(user: models.UserSetup):
    set_up_obj = setup(user)
    return set_up_obj


@app.post("/creates")
def sign_up(user: models.UserCreate):
    sign_up_obj = add_users(user)
    return sign_up_obj


@app.post("/login")
def sign_in(user: models.UserCreate):
    sign_in_obj = read_users(user)
    return sign_in_obj

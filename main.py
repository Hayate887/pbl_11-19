from typing import Union

from database import add_fruits, read_fruits
from fastapi import Body, FastAPI
from models import User

app = FastAPI()


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


@app.post("/users/create/")
def create_users(id: int = Body(...), name: str = Body(...), price: int = Body(...)):
    return {"id": id, "name": name, "price": price}

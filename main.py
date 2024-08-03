from typing import Union

from fastapi import Body, FastAPI

from database import add_fruits, read_fruits

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


@app.post("/fruits")
def create_users(id: int = Body(...), name: str = Body(...), price: int = Body(...)):
    fruits_obj = add_fruits(id, name, price)
    return {"id": fruits_obj.id, "name": fruits_obj.name, "price": fruits_obj.price}




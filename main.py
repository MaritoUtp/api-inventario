from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="API de Inventario")


class ProductoIn(BaseModel):
    nombre: str = Field(min_length=1)
    precio: float = Field(gt=0)
    stock: int = Field(ge=0)


class Producto(ProductoIn):
    id: int


# "Base de datos" temporal: un diccionario en memoria
productos: dict[int, Producto] = {}
siguiente_id = 1


@app.get("/")
def inicio():
    return {"mensaje": "Mi API de inventario funciona"}


@app.post("/productos", response_model=Producto, status_code=201)
def crear_producto(datos: ProductoIn):
    global siguiente_id
    nuevo = Producto(id=siguiente_id, **datos.model_dump())
    productos[siguiente_id] = nuevo
    siguiente_id += 1
    return nuevo


@app.get("/productos")
def listar_productos():
    return list(productos.values())

@app.get("/productos/{producto_id}", response_model=Producto)
def obtener_producto(producto_id: int):
    if producto_id not in productos:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return productos[producto_id]


@app.put("/productos/{producto_id}", response_model=Producto)
def actualizar_producto(producto_id: int, datos: ProductoIn):
    if producto_id not in productos:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    productos[producto_id] = Producto(id=producto_id, **datos.model_dump())
    return productos[producto_id]


@app.delete("/productos/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int):
    if producto_id not in productos:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    del productos[producto_id]
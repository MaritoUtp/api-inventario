from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_crear_y_obtener_producto():
    r = client.post("/productos", json={"nombre": "Mouse", "precio": 25.5, "stock": 10})
    assert r.status_code == 201
    producto_id = r.json()["id"]

    r = client.get(f"/productos/{producto_id}")
    assert r.status_code == 200
    assert r.json()["nombre"] == "Mouse"


def test_precio_invalido():
    r = client.post("/productos", json={"nombre": "X", "precio": -1, "stock": 1})
    assert r.status_code == 422


def test_producto_inexistente():
    assert client.get("/productos/9999").status_code == 404
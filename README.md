# API de Inventario

API REST para gestionar productos, hecha con Python y FastAPI.

## Funciones
- Crear, listar, ver, editar y eliminar productos (CRUD)
- Validación de datos (precio mayor que 0, stock no negativo)
- Documentación automática en `/docs`
- Pruebas automáticas con pytest

## Instalación

```bash
python -m venv venv
venv\Scripts\Activate.ps1      # Windows PowerShell
pip install -r requirements.txt
```

## Ejecutar

```bash
python -m uvicorn main:app --reload
```

Abre http://127.0.0.1:8000/docs

## Pruebas

```bash
pytest
```

## Tecnologías
Python, FastAPI, Pydantic, Uvicorn, Pytest
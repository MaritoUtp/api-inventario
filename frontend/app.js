const API = "http://127.0.0.1:8000";

// Elementos de la página
const form = document.getElementById("form");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputStock = document.getElementById("input-stock");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const buscar = document.getElementById("buscar");
const tabla = document.getElementById("tabla");
const vacio = document.getElementById("vacio");
const mensaje = document.getElementById("mensaje");

// Estado de la aplicación
let productos = [];
let editandoId = null;   // null = modo agregar; un número = modo editar

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.className = esError ? "error" : "ok";
  mensaje.hidden = false;
  setTimeout(() => { mensaje.hidden = true; }, 3000);
}

async function cargar() {
  try {
    const res = await fetch(`${API}/productos`);
    if (!res.ok) throw new Error("Respuesta inválida");
    productos = await res.json();
    dibujar();
  } catch (error) {
    mostrarMensaje("No se pudo conectar con la API. ¿Está encendida?", true);
  }
}

function dibujar() {
  const texto = buscar.value.toLowerCase();
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));

  tabla.innerHTML = "";
  vacio.hidden = filtrados.length > 0;

  for (const p of filtrados) {
    const fila = document.createElement("tr");

    for (const valor of [p.id, p.nombre, p.precio, p.stock]) {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    }

    const celdaAcciones = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "editar";
    btnEditar.onclick = () => empezarEdicion(p);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "eliminar";
    btnEliminar.onclick = () => eliminar(p);

    celdaAcciones.appendChild(btnEditar);
    celdaAcciones.appendChild(btnEliminar);
    fila.appendChild(celdaAcciones);

    tabla.appendChild(fila);
  }
}

cargar();

//////////////////////////////////////


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: inputNombre.value.trim(),
    precio: parseFloat(inputPrecio.value),
    stock: parseInt(inputStock.value),
  };

  const editando = editandoId !== null;
  const url = editando ? `${API}/productos/${editandoId}` : `${API}/productos`;
  const metodo = editando ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error("No se pudo guardar");

    mostrarMensaje(editando ? "Producto actualizado" : "Producto agregado");
    salirEdicion();
    cargar();
  } catch (error) {
    mostrarMensaje("Error al guardar el producto", true);
  }
});


//////////////////////////////////////////

async function eliminar(producto) {
  if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;

  try {
    const res = await fetch(`${API}/productos/${producto.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo eliminar");

    mostrarMensaje("Producto eliminado");
    cargar();
  } catch (error) {
    mostrarMensaje("Error al eliminar el producto", true);
  }
}

function empezarEdicion(producto) {
  editandoId = producto.id;
  inputNombre.value = producto.nombre;
  inputPrecio.value = producto.precio;
  inputStock.value = producto.stock;
  btnGuardar.textContent = "Guardar cambios";
  btnCancelar.hidden = false;
  inputNombre.focus();
}

function salirEdicion() {
  editandoId = null;
  form.reset();
  btnGuardar.textContent = "Agregar";
  btnCancelar.hidden = true;
}

btnCancelar.addEventListener("click", salirEdicion);
buscar.addEventListener("input", dibujar);

cargar();


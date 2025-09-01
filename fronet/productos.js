const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const productoList = document.getElementById('productoList');
const mensajeDiv = document.getElementById('mensaje');
const cerrarSesionBtn = document.getElementById('cerrarSesion');
const productoForm = document.getElementById('productoForm');
const idProductoInput = document.getElementById('idProducto');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const precioInput = document.getElementById('precio');
const imagenInput = document.getElementById('imagen');
const guardarBtn = document.getElementById('guardarBtn');

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticado
    const usuarioId = localStorage.getItem('usuarioId');
    const usuarioRol = localStorage.getItem('usuarioRol');

    if (!usuarioId) {
        // Si no está autenticado, redirigir al login
        window.location.href = 'login.html';
    }

    // Mostrar nombre del usuario en el dashboard
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    document.getElementById('usuarioNombre').textContent = usuarioNombre;

    // Cargar lista de productos
    cargarProductos();

    // Event listeners
    productoForm.addEventListener('submit', guardarProducto);
    cerrarSesionBtn.addEventListener('click', cerrarSesion);
});

// Cerrar sesión
function cerrarSesion() {
    localStorage.clear(); // Limpiar datos de autenticación del localStorage
    mostrarMensaje('Sesión cerrada');
    // Redirigir al login
    window.location.href = 'login.html';
}

// Función para mostrar lista de productos
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        const productos = await response.json();

        productoList.innerHTML = '';

        productos.forEach(producto => {
            mostrarProductoEnLista(producto);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensaje('Error al cargar productos.', false);
    }
}

function mostrarProductoEnLista(producto) {
    const productoCard = document.createElement('div');
    productoCard.className = 'productoCard';

    productoCard.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="productoImagen"/>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>$${producto.precio}</strong></p>
        <button onclick="editarProducto(${producto.id_producto})">Editar</button>
        <button onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
    `;

    productoList.appendChild(productoCard);
}

async function guardarProducto(e) {
    e.preventDefault();

    const idProducto = idProductoInput.value;
    const nombre = nombreInput.value;
    const descripcion = descripcionInput.value;
    const precio = parseFloat(precioInput.value);

    try {
        let response;
        if (idProducto) {
            // Actualizar producto existente (incluyendo imagen si aplica)
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('precio', precio);
            if (imagenInput.files.length > 0) {
                formData.append('imagen', imagenInput.files[0]);
            }

            response = await fetch(`${API_URL}/productos/${idProducto}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Crear nuevo producto (incluyendo imagen)
            const formData = new FormData(productoForm);
            response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                body: formData
            });
        }

        const resultado = await response.json();
        if (resultado.success) {
            mostrarMensaje('Producto guardado exitosamente.', true);
            limpiarFormulario();
            cargarProductos();
        } else {
            mostrarMensaje('Error al guardar producto: ' + resultado.message, false);
        }
    } catch (error) {
        console.error('Error al guardar producto:', error);
        mostrarMensaje('Error al guardar producto.', false);
    }
}

async function eliminarProducto(idProducto) {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos/${idProducto}`, {
            method: 'DELETE'
        });

        const resultado = await response.json();
        if (resultado.success) {
            mostrarMensaje('Producto eliminado correctamente.', true);
            cargarProductos();
        } else {
            mostrarMensaje('Error al eliminar el producto: ' + resultado.message, false);
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarMensaje('Error al eliminar el producto.', false);
    }
}

async function editarProducto(idProducto) {
    try {
        const response = await fetch(`${API_URL}/productos/${idProducto}`);
        const producto = await response.json();

        idProductoInput.value = producto.id_producto;
        nombreInput.value = producto.nombre;
        descripcionInput.value = producto.descripcion;
        precioInput.value = producto.precio;

        document.getElementById('imagenPreview').src = producto.imagen;
        document.getElementById('imagenPreview').style.display = 'block';

        guardarBtn.textContent = 'Actualizar Producto';
    } catch (error) {
        console.error('Error al cargar producto:', error);
        mostrarMensaje('Error al cargar el producto.', false);
    }
}

function limpiarFormulario() {
    idProductoInput.value = '';
    nombreInput.value = '';
    descripcionInput.value = '';
    precioInput.value = '';
    imagenInput.value = '';
    document.getElementById('imagenPreview').style.display = 'none';
    guardarBtn.textContent = 'Guardar Producto';
}

// Función para mostrar mensajes
function mostrarMensaje(texto, esExito = true) {
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';
    mensajeDiv.style.backgroundColor = esExito ? '#d4edda' : '#f8d7da';
    mensajeDiv.style.color = esExito ? '#155724' : '#721c24';

    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}
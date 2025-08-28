-- Crear la base de datos si no existe
CREATE DATABASE register_store;
USE register_store;

-- Crear tabla personas
CREATE TABLE personas (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,    -- Identificador único autoincremental
    nombre VARCHAR(100),                          -- Cadena para el nombre
    apellido VARCHAR(100),                        -- Cadena para el apellido
    tipo_identificacion VARCHAR(50),              -- Tipo de documento: CC, TI, CE, etc.
    nuip INT,                                     -- Número único de identificación (ej: cédula)
    email VARCHAR(100),                           -- Correo electrónico del usuario
    clave VARCHAR(500),                           -- Contraseña encriptada
    salario DECIMAL(10,2),                        -- Valor numérico decimal para salario
    activo BOOLEAN DEFAULT TRUE,                  -- Valor booleano: 1 (activo), 0 (inactivo)
    fecha_registro DATE DEFAULT (CURRENT_DATE),   -- Fecha en la que se registra a la persona
    imagen LONGBLOB                               -- Imagen en binario (para subir una foto)
);

-- Ver los registros actuales de la tabla personas
SELECT * FROM personas;

-- Crear tabla usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100) unique,
    clave VARCHAR(500),
    rol ENUM('cliente', 'admin', 'super_usuario') DEFAULT 'cliente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

Select * From usuarios;

-- Crear tabla productos con campo stock calculado
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,   -- Identificador único autoincremental
    nombre VARCHAR(100) NOT NULL,                 -- Nombre del producto
    descripcion TEXT,                             -- Descripción del producto
    categoria VARCHAR(100),                       -- Categoría a la que pertenece el producto
    entradas INT DEFAULT 0,                       -- La cantidad de productos que entran
    salidas INT DEFAULT 0,                        -- La cantidad de productos que se venden
    stock INT AS (entradas - salidas) VIRTUAL,    -- Stock calculado automáticamente
    precio DECIMAL(10,2) NOT NULL,                -- Precio con dos decimales
    imagen LONGBLOB,                              -- Imagen del producto en binario
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del registro
);

-- Ver los registros actuales de la tabla productos
SELECT * FROM productos;

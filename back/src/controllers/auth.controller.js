const db = require('../config/db');
const bcrypt = require('bcrypt');

class Authcontroller {
    /*registro de nuevos usuarios */
    async registrar(userData) {
        try {
            //verificar si el email ya existe
            const[emailExistente] = await db.query('SELECT email FROM  usuarios WHERE email =  ?', [userData.email]);

            if(emailExistente.length > 0) {
                return {
                    success: false,
                    message: 'el email ya esta registrado'
                };
            }
       
            // encriptar la contraseña
            const saltRounds = 10;
            const hashedpassword =  await bcrypt.hash(userData.clave, saltRounds);

            //crear objetos de usuario con la contraseña encriptada
            const usuario = {
                ...userData,
                clave:hashedpassword
            };

            //insertar e usuario enla base de datos 
            const [resultado] = await db.query('INSERT INTO usuarios SET ?',[usuario]);

            return {
                success:true,
                message:'usuario registrado correctamente',
                userId:resultado.inserId
            };
        } catch (error) {
            console.error('error al registrar usuario:',error);
            throw error;
        }
    }

    // inicio de sesion
    async iniciarSesion(email, clave) {
        try {
            // buscar el usuario por email
            const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?',[email]);

            if (usuarios.length === 0) {
                return {
                    success:false,
                    message:'credenciales invalidas'
                };
            }
            const usuario = usuarios[0];

            // verificar la contraseña
            const passwordMatch = await bcrypt.compare(clave,usuario.clave);

            if (!passwordMatch) {
                return {
                    success:false,
                    message:'credenciales invalidas'
                };
            }

            // crear un objeto con los datos del usuario
            const usuarioData = {
                id_usuario: usuario.id_usuario,
                nombre:usuario.nombre,
                apellido:usuario.apellido,
                email:usuario.email,
                rol: usuario.rol
            };

            return {
                success: true,
                message: 'inicio de sesion exitoso',
                usuario: usuarioData
            };
        } catch (error) {
            console.error('error al iniciar sesion:', error);
            throw error;
        }
    }

    //verificar si un usuario esta autenticado
    async verificarUsuario(userId) {
        try {
            const [usuarios] =  await db.query('SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = ?',[userId]);

            if (usuarios.length === 0) {
                return {
                    success: false,
                    message:'usuario no encontrado'
                };
            }

            return {
                success: true,
                usuario:usuarios[0]
            };
        } catch (error) {
            console.error('error al verificar usuario:', error);
            throw error;
        }
    }
}


module.exports = new Authcontroller();
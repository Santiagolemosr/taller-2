const { TokenExpiredError } = require('jsonwebtoken');
const db = require('../config/db');

class CrudController {
    async obtenerTodos(){
        try {
            const [resultados] = await db.query(`SELECT * FROM ${tabla}`);
            return resultados;
        }catch (error) {
            throw error;
        }
    }

    async obtenerUno(tabla,idcampo, id) {
        try {
            const [resultado] = await db.query(`SELECT * FROM ?? WHERE ?`,[tabla, idcampo, id]);
            return resultado[0];
        }catch (error) {
            throw error;
        }
    }

    async crear(tabla, data) {
        try {
            const [resultado] = await db.query(`INSERT INTO ?? SET ?`, [tabla, data]);
            return { ...data, id: resultado.insertId};
        } catch (error) {
            throw error;
        }
    }
    async actualizar(tabla, idcampo, id, data) {
        try {
            const [resultado] = await db.query(`UPDATE ?? SET ? WHERE ?? = ?`, [tabla, idcampo, id, data]);
            if (resultado.affectedRows === 0) {
                throw new Error('registro no encontrado');
            }
            return await this.obtenerUno(tabla,idcampo, id);
        } catch (error) {
            throw error;
        }
    }
    async eliminar(tabla, idcampo, id) {
        try {
            const [resultado] =  await db.query(`DELETE FROM ?? WHERE ?? = ?`, [tabla, idcampo,id]);
            if (resultado.affectedRows ===0) {
                throw new Error('registro no encontrado');
            }
            return { mensaje:'registro eliminado correctamente'};
        } catch ( error) {
            throw error;
        }
    }
}


module.exports = CrudController;
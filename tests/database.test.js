const mariadb = require('mariadb');
const rewire = require('rewire');
const assert = require('assert'); // para las aserciones básicas

// Rewire para acceder a funciones internas del archivo 'database.js'
const database = rewire('../database.js');

// Extraer las funciones a testear
const pool1 = database.__get__('pool1');

describe('Pruebas de Base de Datos', function () {

    it('Debe conectarse correctamente a la base de datos', async function () {
        let conn;
        try {
            // Forzamos un error para que falle
            throw new Error('Falla intencional en la conexión');
            
            conn = await pool1.getConnection();
            assert(conn, 'La conexión a la base de datos debería estar establecida');
        } catch (err) {
            // El test fallará aquí debido a la excepción forzada
            assert.fail(`Error de conexión a la base de datos: ${err.message}`);
        } finally {
            if (conn) conn.end(); // Cierra la conexión al final si hay una
        }
    });
});

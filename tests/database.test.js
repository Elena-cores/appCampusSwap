const mariadb = require('mariadb');
const rewire = require('rewire');
const assert = require('assert'); // para las aserciones básicas

// Rewire para acceder a funciones internas del archivo 'database.js'
const database = rewire('../database.js');

// Extraer las funciones a testear
const pool1 = database.__get__('pool1');
const setUp = database.__get__('setUp');

describe('Pruebas de Base de Datos', function () {
    it('Debe conectarse correctamente a la base de datos', async function () {
        let conn;
        try {
            conn = await pool1.getConnection();
            assert(conn, 'La conexión a la base de datos debería estar establecida');
        } catch (err) {
            assert.fail(`Error de conexión a la base de datos: ${err.message}`);
        } finally {
            if (conn) conn.end(); // Cierra la conexión al final
        }
    });

     // Test 2: Verificar que se crean correctamente la base de datos y las tablas
     it('Debe crear la base de datos y las tablas correctamente', async function () {
        let conn;
        try {
            conn = await pool1.getConnection();
            await setUp(conn); // Llama a la función setUp para crear la base de datos y las tablas

            // Verificamos que la base de datos y las tablas fueron creadas
            const dbExist = await conn.query("SHOW DATABASES LIKE 'campus'");
            assert(dbExist.length > 0, 'La base de datos campus debería existir');

            const tableExist = await conn.query("SHOW TABLES LIKE 'user'");
            assert(tableExist.length > 0, 'La tabla user debería existir');

            const tableExistAds = await conn.query("SHOW TABLES LIKE 'ads'");
            assert(tableExistAds.length > 0, 'La tabla ads debería existir');
        } catch (err) {
            assert.fail(`Error al crear la base de datos o tablas: ${err.message}`);
        } finally {
            if (conn) conn.end();
        }
    });
});

const mariadb = require('mariadb');
const rewire = require('rewire');
const assert = require('assert'); // para las aserciones básicas

// Rewire para acceder a funciones internas del archivo 'database.js'
const database = rewire('../database.js');

// Extraer las funciones a testear
const pool1 = database.__get__('pool1');
const pool2 = database.__get__('pool2');
const setUp = database.__get__('setUp');
const insertUser = database.__get__('insertUser');
const insertAds = database.__get__('insertAds');

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

    // Test 3: Verificar la inserción de un usuario
    it('Debe insertar correctamente un usuario', async function () {
        const name = "david";
        const surname = "smith";
        const username = "dsmith";
        const password = "david1";
        const email = "ds@gmail.com";

        let conn;
        let result;
        try {
            // Ahora se llama a insertUser para insertar el usuario
            await insertUser(name, surname, username, password, email); // Inserta el usuario
            conn = await pool2.getConnection();
            await conn.query("USE campus");
            console.log(result);
            result = await conn.query(`SELECT * FROM user WHERE email = "${email}";`);
            assert(result.length > 0, 'El usuario debería haber sido insertado en la base de datos');
            assert(result[0].username === username, 'El nombre de usuario debería coincidir');
        } catch (err) {
            assert.fail(`Error al insertar el usuario: ${err.message}`);
        } finally {
            if (conn) conn.end();
        }
    });

    // Test 4: Verificar la inserción de nuevas publicaciones
    it('Debe registrar correctamente las nuevas publicaciones', async function() {
        const description = "Libro";
        const price = 10;
        const state = 0;
        const university = "CEU";
        const photo = "foto.jpg";
        
        let conn;
        try {
            await insertAds(description, price, state, university, photo);
            conn = await pool2.getConnection();
            await conn.query("USE campus");
    
            const result = await conn.query(`SELECT * FROM ads WHERE description = "${description}";`);
            assert(result.length > 0, 'La publicación debería haber sido insertada en la base de datos');
            assert(result[0].price === price, 'El precio debería coincidir');
        } catch (err) {
            assert.fail(`Error al insertar la publicación: ${err.message}`);
        } finally {
            if (conn) conn.end();
        }
    });
});

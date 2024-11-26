const assert = require('assert'); 
const favoritesDatabase = require('../favoritoDatabase');
const pool2 = require('../database').pool2; 


describe('Favorites Database', function () {
    describe('addFavorite', function () {
        it('Debe agregar correctamente un ', async function () {
            const id_user = 1; // id de usuario simulado
            const id_ad = 1; // id de anuncio simulado

            let conn;
            try {
                await favoritesDatabase.addFavorite(id_user, id_ad);    //add favorito
                conn = await pool2.getConnection();
                await conn.query("USE campus");

                const [result] = await conn.query(
                    `SELECT COUNT(*) AS count FROM favorites WHERE user_id = ? AND ad_id = ?`, 
                    [id_user, id_ad]
                );
                assert(result.count > 0, 'El anuncio debe haber sido agregado a favoritos');
            } catch (err) {
                assert.fail(`Error al agregar a favoritos: ${err.message}`);
            } finally {
                if (conn) conn.end();
            }
        });
    });
});

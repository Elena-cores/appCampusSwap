var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function(req, res, next) {
  let userId = req.session.userId;

  if (!userId) {
    return res.status(401).send("Usuario no autenticado");
  }

  database.pool2.getConnection().then(async (conn) => {
    conn.query("USE campus");

    // Obtener anuncios favoritos y nombre de usuario
    const [ads, user] = await Promise.all([
      conn.query(`
        SELECT a.* 
        FROM favorites f
        JOIN ads a ON f.ad_id = a.id_ad
        WHERE f.user_id = ?
      `, [userId]),
      conn.query(`
        SELECT username 
        FROM user 
        WHERE id_user = ?
      `, [userId])
    ]);

    conn.end();

    if (user.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.render('favoritos', { 
      title: 'Anuncios Favoritos', 
      ads: ads, 
      username: user[0].username 
    });
  }).catch((err) => {
    console.error("Error al recuperar favoritos:", err.message);
    res.status(500).send("Error al recuperar favoritos.");
  });
});

module.exports = router;
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
  
    const ads = await conn.query(`
      SELECT a.* 
      FROM favorites f
      JOIN ads a ON f.ad_id = a.id_ad
      WHERE f.user_id = ?
    `, [userId]);
    conn.end();

    res.render('favoritos', { title: 'Anuncios Favoritos', ads });
  }).catch((err) => {
    console.error("Error al recuperar favoritos:", err.message);
    res.status(500).send("Error al recuperar favoritos.");
  });
});

module.exports = router;
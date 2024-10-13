var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  database.pool2.getConnection().then(async (conn) => {
    conn.query("USE campus");
    const ads = await conn.query('SELECT * FROM ads;');
    conn.end();

    // Renderiza la página listadoFinal.ejs, pasando los anuncios (ads) obtenidos de la base de datos
    res.render('listadoFinal', { title: 'Final catalogue page', ads: ads });
  }).catch((err) => {
    console.error("Error al recuperar anuncios:", err.message);
    res.status(500).send("Error al recuperar anuncios.");
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET nueva publicación */
router.get('/', function(req, res, next) {
    res.render('nuevaPublicacion', { title: 'Nueva Publicación' });
});

router.post("/", function(req, res, next) {
    let description = req.body.description;
    let price = parseFloat(req.body.price); 
    let state = parseInt(req.body.state, 10); 
    let university = req.body.university;
    let photo = req.body.photo;

    async function insertAd() {
        await database.insertAds(description, price, state, university, photo);
        res.redirect("/listadoFinal");
    }

    insertAd().catch(error => {
        console.error("Error al registrar el anuncio:", error.message);
        res.status(500).send("Error al registrar el anuncio.");
    });
});

module.exports = router;

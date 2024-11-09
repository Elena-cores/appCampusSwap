var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function(req, res, next) {
    const from = req.query.from || 'perfil'; // obtener parametro 'from' de la url
    res.render('nuevaPublicacion', { title: 'Nueva Publicación', from: from });
});

router.post("/", function(req, res, next) {
    let description = req.body.description;
    let price = parseFloat(req.body.price); 
    let state = parseInt(req.body.state, 10); 
    let university = req.body.university;
    let photo = req.body.photo;
    let userId = req.session.userId;

    // Verificar si userId existe
    if (!userId) {
        console.error("Error: No hay ID de usuario en la sesión");
        res.redirect("/login");
        return;
    }

    async function insertAd() {
        try {
            await database.insertAds(description, price, state, university, photo, userId);
            res.redirect("/listado");
        } catch (error) {
            console.error("Error al registrar el anuncio:", error);
            res.status(500).send("Error al registrar el anuncio.");
        }
    }

    insertAd();
});
module.exports = router;
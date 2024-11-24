var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function(req, res, next) {
  // Obtener el ID del usuario de la sesión
  let userId = req.session.userId;

  // Obtener los anuncios del usuario
  database.getAdsByUser(userId).then(ads => {
    res.render('perfil', { 
      title: 'Profile page',
      username: req.session.username,
      userAds: ads
    });
  }).catch(error => {
    console.error("Error al obtener anuncios del usuario:", error);
    res.status(500).send("Error al cargar el perfil.");
  });
});

router.get('/en-venta', function(req, res) {
  let userId = req.session.userId;

  database.getAdsByUser(userId).then(ads => {
    let enVentaAds = ads.filter(ad => ad.state === 'Disponible' || ad.state === 'Reservado');
    res.json(enVentaAds);
  }).catch(error => {
    console.error("Error al obtener anuncios en venta:", error);
    res.status(500).send("Error al cargar anuncios en venta.");
  });
});

router.get('/vendidos', function(req, res) {
  let userId = req.session.userId;

  database.getAdsByUser(userId).then(ads => {
    let vendidosAds = ads.filter(ad => ad.state === 'Vendido');
    res.json(vendidosAds);
  }).catch(error => {
    console.error("Error al obtener anuncios vendidos:", error);
    res.status(500).send("Error al cargar anuncios vendidos.");
  });
});

router.post('/marcar-vendido/:id', function(req, res) {
  let adId = req.params.id;
  let userId = req.session.userId;

  database.updateVendido(adId, userId).then(result => {
    if (result) {
      res.json({ success: true, message: 'El producto ha sido marcado como vendido.' });
    } else {
      res.status(403).json({ success: false, message: 'No autorizado para marcar este anuncio como vendido.' });
    }
  }).catch(error => {
    console.error("Error al marcar el anuncio como vendido:", error);
    res.status(500).json({ success: false, message: 'Error al marcar el anuncio como vendido.' });
  });
});

router.delete('/delete/:id', function(req, res) {
  let adId = req.params.id;
  let userId = req.session.userId;

  database.deleteAd(adId, userId).then(result => {
      if (result) {
          res.json({ success: true });
      } else {
          res.status(403).json({ success: false, message: 'No autorizado para eliminar este anuncio' });
      }
  }).catch(error => {
      console.error("Error al eliminar anuncio:", error);
      res.status(500).json({ success: false, message: 'Error al eliminar el anuncio' });
  });
});

module.exports = router;
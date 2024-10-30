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
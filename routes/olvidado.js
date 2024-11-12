var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('olvidado', { title: 'Contraseña olvidada' });
});

router.post("/", function(req, res) {
  
  const { password: actPassword, email: userEmail } = req.body;  

  database.updateUser(actPassword, userEmail).then(() => {
    console.log('Password aggiornata con successo');
    return res.json({ success: true });
  }).catch((error) => {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error update contraseña',
      error: error.message 
    });
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('olvidado', { title: 'Contraseña olvidada' });
});

router.post("/", async function(req, res) {
  const { password: actPassword, email: userEmail } = req.body;

  var existencia = await existe(userEmail);
  if(existencia==true){  
    console.log("test");
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
  }else{
    console.log("Email no registrada");
  }
});

async function existe(userEmail){
  try {
    const conn = await database.pool2.getConnection();
    await conn.query("USE campus");
    
    const rows = await conn.query(`SELECT email FROM user WHERE email = '${userEmail}'`);
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

module.exports = router;
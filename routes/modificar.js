var express = require('express');
var router = express.Router();
var database = require('../database');
var isAuthenticated = require('../middleware/authMiddleware');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('modificar', { title: 'Modificar contraseña' });
});
router.post('/api/change-password', isAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userEmail = req.user.email; // Correo electrónico desde el token

  try {
      // Buscar al usuario en la base de datos usando el correo electrónico
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      // Verificar que la contraseña actual sea correcta
      if (user.password !== currentPassword) {
          return res.status(400).json({ success: false, message: "Contraseña actual incorrecta" });
      }

      
      

      // Actualizar la contraseña en la base de datos
      user.password = newPassword;
      database.updateUser(newPassword, userEmail);

      res.json({ success: true, message: "Contraseña cambiada exitosamente" });
  } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});
module.exports = router;

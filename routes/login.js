var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Inicio de sesión' });
});

router.post('/', function(req, res, next) {
    let pwd = req.body.password;
    let email = req.body.email; 

    if(email && pwd) {
       database.pool2.getConnection().then(async (conn) => {
        conn.query("USE campus");
        var consulta = await conn.query(`SELECT id_user, username FROM user WHERE email ="${email}" AND password = "${pwd}";`);

        if(consulta.length > 0) {
            // Añadir logs para verificar
            console.log("Usuario encontrado:");
            console.log("ID:", consulta[0].id_user);
            console.log("Username:", consulta[0].username);

            req.session.userId = consulta[0].id_user;
            req.session.username = consulta[0].username;

            // Verificar que se guardó en la sesión
            console.log("Sesión guardada:");
            console.log("Session userId:", req.session.userId);
            console.log("Session username:", req.session.username);

            conn.end();
            res.redirect("/listado");
        } else {
            console.log("No se encontró el usuario");
            conn.end();
            res.redirect("/login");
        }
    }).catch((err) => {
        console.log(err);
        console.log("No se ha podido realizar el SELECT");
    });
    } else {
        res.redirect("/login")
    }
});
module.exports = router;
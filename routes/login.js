var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('loginPage', { title: 'Inicio de sesión' });
});

router.post('/', function(req, res, next) {
    //obtenemos datos del formulario
    let pwd = req.body.password;
    let email = req.body.email; 

    if(email && pwd) {
       database.pool2.getConnection().then(async (conn) => {
        conn.query("USE campus");
        var consulta = await conn.query(`SELECT username FROM user WHERE email ="${email}" AND password = "${pwd}";`);

        if(consulta.length > 0) {
            console.log("bienvenido usuario!");
            conn.end();
            res.redirect("/listado");
        }
        else {
            conn.end();
            res.redirect("/login");
        }
    }).catch((err) => {
        console.log(err);
        console.log("No se ha podido realizar el SELECT");
    });
    }
    else { //el usuario no ha rellenado los campos de email o psw en el formulario
        res.redirect("/login")
    }
});

module.exports = router;
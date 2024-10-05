var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'registro de nuevos usuarios' });
});

router.post("/", function(req, res, next) {
    let name = req.body.name;
    let surname = req.body.surname; 
    let username = req.body.username;
    let psw = req.body.password; 
    let email = req.body.email;  

    async function insertUser() {
        database.insertUser(name, surname, username, psw, email);
        res.redirect("/login");
    }

    insertUser();
});

module.exports = router;


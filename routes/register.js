var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('registerPage', { title: 'registro de nuevos usuarios' });
});

module.exports = router;


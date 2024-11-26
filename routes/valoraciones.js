var express = require('express');
var router = express.Router();
const { pool2 } = require('../database');



router.get('/', function(req, res) {
  if (!req.session.userId) {
      return res.redirect('/login'); 
  }

  res.render('valoraciones', { title: 'Valoraciones' });
});




router.get('/comprado', async function(req, res) {
    let userId = req.session.userId; 
    if (!userId) {
        return res.status(403).json({ error: 'No autenticado' });
    }

    try {
        const conn = await pool2.getConnection();
        await conn.query("USE campus");

        const valoraciones = await conn.query(`
            SELECT v.*, u2.username AS vendedor, a.title AS producto 
            FROM valoraciones v
            JOIN user u2 ON v.vendedor_id = u2.id_user
            JOIN ads a ON v.ad_id = a.id_ad
            WHERE v.comprador_id = ?
            ORDER BY v.FechaValoracion DESC
        `, [userId]);

        conn.release();
        res.json(valoraciones);
    } catch (error) {
        console.error('Error al obtener valoraciones como comprador:', error);
        res.status(500).json({ error: 'Error al obtener las valoraciones como comprador.' });
    }
});

router.get('/vendido', async function(req, res) {
    let userId = req.session.userId; 
    if (!userId) {
        return res.status(403).json({ error: 'No autenticado' });
    }

    try {
        const conn = await pool2.getConnection();
        await conn.query("USE campus");

        const valoraciones = await conn.query(`
            SELECT v.*, u1.username AS comprador, a.title AS producto 
            FROM valoraciones v
            JOIN user u1 ON v.comprador_id = u1.id_user
            JOIN ads a ON v.ad_id = a.id_ad
            WHERE v.vendedor_id = ?
            ORDER BY v.FechaValoracion DESC
        `, [userId]);

        conn.release();
        res.json(valoraciones);
    } catch (error) {
        console.error('Error al obtener valoraciones como vendedor:', error);
        res.status(500).json({ error: 'Error al obtener las valoraciones como vendedor.' });
    }
});



module.exports = router;
var express = require('express');
var router = express.Router();
var database = require('../database');

// Ruta para buscar usuarios
router.post('/search', async (req, res) => {
    const { username } = req.body;

    try {
        const conn = await database.pool2.getConnection();
        await conn.query("USE campus");
        const users = await conn.query(`SELECT id_user, username FROM user WHERE username LIKE ?`, [`%${username}%`]);
        conn.release();

        if (users.length > 0) {
            res.json({ success: true, users });
        } else {
            res.json({ success: false, message: 'No se encontraron usuarios.' });
        }
    } catch (error) {
        console.error("Error al buscar usuarios:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Ruta para enviar mensajes
router.post('/send-message', async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.session.userId;

    try {
        const conn = await database.pool2.getConnection();
        await conn.query("USE campus");
        const result = await conn.query(`INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())`, 
            [senderId, receiverId, content]);

        const messageId = result.insertId.toString(); // Convert messageId to string
        conn.release();
        res.json({ success: true, message: 'Mensaje enviado.', messageId });

        // Emitir evento de nuevo mensaje
        req.app.get('io').emit('messageReceived', { sender_id: senderId, receiver_id: receiverId, content });
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

router.get('/', function(req, res) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('buzon', { 
        title: 'Buzón', 
        username: req.session.username,
        activePage: 'buzon' 
    });
});

// Ruta para obtener conversaciones
router.get('/conversations', async (req, res) => {
    const userId = req.session.userId;

    try {
        const conn = await database.pool2.getConnection();
        await conn.query("USE campus");
        const conversations = await conn.query(`
            SELECT DISTINCT 
                u.id_user,
                u.username,
                MAX(m.timestamp) as last_message_time
            FROM messages m
            JOIN user u ON (
                CASE 
                    WHEN m.sender_id = ? THEN m.receiver_id = u.id_user
                    ELSE m.sender_id = u.id_user
                END
            )
            WHERE m.sender_id = ? OR m.receiver_id = ?
            GROUP BY u.id_user, u.username
            ORDER BY last_message_time DESC`, [userId, userId, userId]);
        conn.release();
        res.json({ success: true, conversations });
    } catch (error) {
        console.error("Error al obtener conversaciones:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Ruta para obtener mensajes de una conversación
router.get('/messages/:userId', async (req, res) => {
    const currentUserId = req.session.userId;
    const otherUserId = req.params.userId;

    try {
        const conn = await database.pool2.getConnection();
        await conn.query("USE campus");
        const messages = await conn.query(`
            SELECT 
                m.*,
                u_sender.username as sender_username,
                u_receiver.username as receiver_username
            FROM messages m
            JOIN user u_sender ON m.sender_id = u_sender.id_user
            JOIN user u_receiver ON m.receiver_id = u_receiver.id_user
            WHERE (sender_id = ? AND receiver_id = ?) 
               OR (sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp ASC`, 
            [currentUserId, otherUserId, otherUserId, currentUserId]);

        conn.release();
        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Ruta para eliminar mensajes
router.delete('/delete-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    const userId = req.session.userId;

    try {
        const conn = await database.pool2.getConnection();
        await conn.query("USE campus");
        const result = await conn.query(`DELETE FROM messages WHERE id_message = ? AND sender_id = ?`, [messageId, userId]);
        conn.release();

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Mensaje eliminado.' });
            req.app.get('io').emit('messageDeleted', { messageId, userId });
        } else {
            res.json({ success: false, message: 'No se pudo eliminar el mensaje.' });
        }
    } catch (error) {
        console.error("Error al eliminar el mensaje:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Ruta para eliminar una conversación
router.delete('/delete-conversation/:userId', async (req, res) => {
    const currentUserId = req.session.userId;
    const otherUserId = req.params.userId;

    try {
        const conn = await database.pool2.getConnection();
        await conn.query("USE campus");
        await conn.query(`DELETE FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`, 
            [currentUserId, otherUserId, otherUserId, currentUserId]);
        conn.release();
        res.json({ success: true, message: 'Conversación eliminada.' });
    } catch (error) {
        console.error("Error al eliminar la conversación:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

module.exports = router;
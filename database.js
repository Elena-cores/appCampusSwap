const mysql = require("mariadb");

const pool1 = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "root",
  connectionLimit: 20,
  acquireTimeout: 30000
});

const pool2 = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "root",
  connectionLimit: 20,
  acquireTimeout: 30000
});

pool1.getConnection().then(async (conn) => { 
  console.log('conexión establecida');
  setUp(conn);
  conn.end(); 
  console.log("La base de datos está creada");
}).catch((err) => {
    console.log(err);
    console.log('conexión no establecida');
});

function setUp(conn){
  conn.query("CREATE DATABASE IF NOT EXISTS campus CHARACTER SET='utf8' COLLATE='utf8_bin'");
  conn.query("USE campus");
  conn.query("CREATE TABLE IF NOT EXISTS user (id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL "
      + ", surname VARCHAR(50) NOT NULL, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL "
      + ", email VARCHAR(50) NOT NULL UNIQUE)"
   );
  conn.query("CREATE TABLE IF NOT EXISTS ads (id_ad INT PRIMARY KEY NOT NULL AUTO_INCREMENT, description VARCHAR(300) NOT NULL"
      + ", price DOUBLE NOT NULL, state BOOLEAN NOT NULL, university VARCHAR(20), photo VARCHAR(20) NOT NULL, id_user INT, "
      + "FOREIGN KEY (id_user) REFERENCES user(id_user))"
  );
}
function insertUser(name, surname, username, password, email) {
  pool2.getConnection().then((conn) => {
      conn.query("USE campus");
      let sql = `INSERT INTO user (name, surname, username, password, email) 
                 VALUES ('${name}', '${surname}', '${username}', '${password}', '${email}')`;

      return conn.query(sql).then(() => {
          console.log("Usuario insertado con éxito");
      }).catch(err => {
          console.error("Error al insertar usuario:", err.message);
      }).finally(() => {
          conn.end();
      });
  }).catch((err) => {
      console.error("No se pudo conectar a la base de datos:", err.message);
  });
}

function insertAds(description, price, state, university, photo, id_user) {
  pool2.getConnection().then((conn) => {
      conn.query("USE campus");
      let sql = `INSERT INTO ads (description, price, state, university, photo, id_user) 
                 VALUES ('${description}', 
                         ${price}, 
                         ${state}, 
                         '${university}', 
                         '${photo}',
                         ${id_user})`;

      conn.query(sql).then(() => {
          console.log(`Anuncio registrado con éxito para el usuario con ID: ${id_user}`);
          // Consulta adicional para verificar
          return conn.query(`SELECT a.*, u.username 
                           FROM ads a 
                           JOIN user u ON a.id_user = u.id_user 
                           WHERE a.id_user = ${id_user} 
                           ORDER BY a.id_ad DESC LIMIT 1`);
      }).then((result) => {
          if(result.length > 0) {
              console.log('Detalles del anuncio insertado:');
              console.log(`- ID del anuncio: ${result[0].id_ad}`);
              console.log(`- Descripción: ${result[0].description}`);
              console.log(`- Precio: ${result[0].price}`);
              console.log(`- Usuario: ${result[0].username} (ID: ${result[0].id_user})`);
          }
      }).catch(err => {
          console.error("Error al insertar anuncio:", err.message);
      }).finally(() => {
          conn.end();
      });
  }).catch((err) => {
      console.error("No se pudo conectar a la base de datos:", err.message);
  });
}

// Nueva función para obtener los anuncios de un usuario específico
function getAdsByUser(id_user) {
  return pool2.getConnection().then((conn) => {
      conn.query("USE campus");
      return conn.query(`SELECT * FROM ads WHERE id_user = ${id_user}`).then((rows) => {
          conn.end();
          return rows;
      });
  }).catch((err) => {
      console.error("Error al obtener anuncios del usuario:", err.message);
      return [];
  });
}

function deleteAd(adId, userId) {
  return pool2.getConnection().then((conn) => {
      conn.query("USE campus");
      return conn.query('DELETE FROM ads WHERE id_ad = ? AND id_user = ?', [adId, userId])
      .then((result) => {
          conn.end();
          return result.affectedRows > 0;
      });
  }).catch((err) => {
      console.error("Error al eliminar anuncio:", err.message);
      return false;
  });
}


module.exports = {pool1, pool2, setUp, insertUser, insertAds, getAdsByUser, deleteAd};
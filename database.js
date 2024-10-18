const mysql = require("mariadb");

const pool1 = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "root",
  connectionLimit: 20,  // Aumenta el límite de conexiones
  acquireTimeout: 30000 // Aumenta el tiempo de espera para obtener una conexión (en milisegundos)
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

  // setup
  function setUp(conn){
    conn.query("CREATE DATABASE IF NOT EXISTS campus CHARACTER SET='utf8' COLLATE='utf8_bin'");
    conn.query("USE campus");
    conn.query("CREATE TABLE IF NOT EXISTS user (id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL "
        + ", surname VARCHAR(50) NOT NULL, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL "
        + ", email VARCHAR(50) NOT NULL UNIQUE)"
     );
    conn.query("CREATE TABLE IF NOT EXISTS ads (id_ad INT PRIMARY KEY NOT NULL AUTO_INCREMENT, description VARCHAR(300) NOT NULL"
        + ", price DOUBLE NOT NULL, state BOOLEAN NOT NULL, university VARCHAR(20), photo VARCHAR(20) NOT NULL)"
    );
  }



// insertar usuarios
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
          conn.end(); // Cerrar la conexión siempre que esté abierta
      });
  }).catch((err) => {
      console.error("No se pudo conectar a la base de datos:", err.message);
  });
}



function insertAds(description, price, state, university, photo) {
  pool2.getConnection().then((conn) => {
      conn.query("USE campus");
      let sql = `INSERT INTO ads (description, price, state, university, photo) 
                 VALUES ('${description}', 
                         ${price}, 
                         ${state}, 
                         '${university}', 
                         '${photo}')`;

      conn.query(sql).then(() => {
          console.log("Anuncio registrado con éxito");
      }).catch(err => {
          console.error("Error al insertar anuncio:", err.message);
      }).finally(() => {
          conn.end();
      });
  }).catch((err) => {
      console.error("No se pudo conectar a la base de datos:", err.message);
  });
}





module.exports = {pool1, pool2, setUp, insertUser, insertAds};


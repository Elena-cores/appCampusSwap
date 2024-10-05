const mysql = require("mariadb");

const pool1 = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "root"
  });

  var pool2 = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "root"
  });



  pool1.getConnection().then(async (conn) => { // 1. Pedimos una conexión a la base de datos
    console.log('conexión establecida');
    setUp(conn);
    conn.end(); 
    console.log("La base de datos está creada");
    // Cerrar la conexión si se ha establecido
    }).catch((err) => {
      console.log(err);
      console.log('conexión no establecida');
      conn.end(); 
      
  });

  // setup
  function setUp(conn){
    conn.query("CREATE DATABASE IF NOT EXISTS campus CHARACTER SET='utf8' COLLATE='utf8_bin'");
    conn.query("USE campus");
    console.log("bd campus OK");
    conn.query("CREATE TABLE IF NOT EXISTS user (id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL "
        + ", surname VARCHAR(50) NOT NULL, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL "
        + ", email VARCHAR(50) NOT NULL UNIQUE)"
     );
    console.log("Tabla user OK");
    conn.query("CREATE TABLE IF NOT EXISTS ads (id_ad INT PRIMARY KEY NOT NULL AUTO_INCREMENT, description VARCHAR(300) NOT NULL"
        + ", price DOUBLE NOT NULL, state BOOLEAN NOT NULL, university VARCHAR(20), photo VARCHAR(20) NOT NULL)"
    );
    console.log("Tabla ads OK");
  }



// insertar usuarios
function insertUser(name, surname, username, password, email) {  //variables se extraerán de formulario ejs 
    pool2.getConnection().then((conn) => {
      conn.query("USE campus");
        let sql = `INSERT INTO user (name, surname, username, password, email) 
        VALUES ('${name}', 
                '${surname}',
                '${username}',
                '${password}',   
                '${email}')`;

        conn.query(sql).then(() => {
            console.log("Usuario insertado con éxito");
        }).catch(err => { 
            console.log(err);
            console.log(err.message);
        }).finally(() => {
            conn.end(); // Cerrar la conexión
        });
    }).catch((err) => {
        console.log("No se pudo conectar");  
        console.log(err);
    });
}



module.exports = {pool1, pool2, setUp, insertUser};


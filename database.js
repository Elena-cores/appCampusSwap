const mysql = require("mariadb");

var pool = mariadb.createPool({
    host: "localhost",
    user: "root", 
    password: "root",
    database: "cs"
  });
 

  pool.getConnection().then((conn) => { // 1. Pedimos una conexión a la base de datos
    console.log('conexión establecida');
    setUp(conn);

  })

  // setup

  function setUp(conn){
    conn.query("CREATE DATABASE IF NOT EXISTS cs CHARACTER SET='utf8' COLLATE='utf8_bin'");
    conn.query("USE cs");
    console.log("bd cs OK");
    conn.query("CREATE TABLE IF NOT EXISTS user (id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL "
        + ", surname VARCHAR(50) NOT NULL, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL "
        + ", email VARCHAR(50) NOT NULL UNIQUE)"
     )
    conn.query("CREATE TABLE IF NOT EXISTS ads (id_ad INT PRIMARY KEY NOT NULL AUTO_INCREMENT, description VARCHAR(300) NOT NULL"
        + ", price DOUBLE NOT NULL, state BOOLEAN NOT NULL, university VARCHAR(20), photo VARCHAR(20) NOT NULL)"
    )
  }


module.exports = {pool};

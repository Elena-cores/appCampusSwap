const mysql = require("mariadb");

var pool = mariadb.createPool({
    host: "localhost",
    user: "root", 
    password: "root",
    database: "campusswap"
  });
 
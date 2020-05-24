const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
var connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected Database!");
  connection.query("CREATE DATABASE if not exists mydb", function (err, result) {
    if (err) throw err;
    connection.query("USE mydb");
    var queries = [
      `CREATE TABLE  if not exists Product
          (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            Type VARCHAR(7) NOT NULL,
            Cost int(5) NOT NULL,
            Quantity int(2) NOT NULL
          ); `,
      `CREATE TABLE if not exists Cart
          (
              id VARCHAR(255) NOT NULL PRIMARY KEY
          );`,
      `CREATE TABLE if not exists Customer
          (
              id VARCHAR(255) NOT NULL PRIMARY KEY,
              email VARCHAR(25) NOT NULL unique ,
              Name VARCHAR(20) NOT NULL,
              Cart_id VARCHAR(255) NOT NULL,
              FOREIGN KEY(Cart_id) REFERENCES cart(id)
          );`,
      `CREATE TABLE if not exists tokens
          ( 
            token varchar(255) NOT NULL PRIMARY KEY,
            Customer_id varchar(255) NOT NULL ,
            FOREIGN KEY (Customer_id) REFERENCES Customer(id)
          );`,
      `CREATE TABLE if not exists password
          (
             password varchar(255) NOT NULL PRIMARY KEY,
             Customer_id varchar(255) NOT NULL ,
             FOREIGN KEY (Customer_id) REFERENCES Customer(id)
          );`,
      ` CREATE TABLE  if not exists Cart_item
        (
          Quantity int(5) NOT NULL,
          Date_Added DATE NOT NULL,
          Cart_id VARCHAR(7) NOT NULL,
          Product_id VARCHAR(7) NOT NULL,
          FOREIGN KEY(Cart_id) REFERENCES Cart(id),
          FOREIGN KEY(Product_id) REFERENCES Product(id),
          Primary key(Cart_id, Product_id)
        );`
    ]
    queries.forEach(query => connection.query(query))

  });
});
module.exports = connection;
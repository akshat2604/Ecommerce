const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
var connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected Database!");
  connection.query("CREATE DATABASE if not exists mydb", function (err, result) {
    if (err) throw err;
    connection.query(`USE ${dbConfig.DB}`);
    var queries = [

      `CREATE TABLE if not exists Cart
          (
              id VARCHAR(255) NOT NULL PRIMARY KEY
          );`
      ,
      `CREATE TABLE if not exists Customer
          (
              id VARCHAR(255) NOT NULL PRIMARY KEY,
              email VARCHAR(25) NOT NULL unique ,
              Name VARCHAR(20) NOT NULL,
              phone_number varchar(20) not null unique,
              pincode varchar(20) not null,
              address varchar(255) not null,
              Cart_id VARCHAR(255) NOT NULL,
              isseller int(1) not null default 0,
              FOREIGN KEY(Cart_id) REFERENCES cart(id)
          );`
      ,
      `CREATE TABLE  if not exists Product
          (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            Type VARCHAR(17) NOT NULL,
            isvisible int(1) default 1 not null,
            image varchar(10000) not null,
            Cost int(5) NOT NULL,
            Quantity int(2) NOT NULL,
            name varchar(255) not null,
            seller_id VARCHAR(255) NOT NULL,
            FOREIGN KEY(seller_id) REFERENCES customer(id)
          ); `,
      `CREATE TABLE if not exists password
          (
             password varchar(255) NOT NULL ,
             Customer_id varchar(255) NOT NULL PRIMARY KEY ,
             FOREIGN KEY (Customer_id) REFERENCES Customer(id)
          );`
      ,
      `CREATE TABLE  if not exists Cart_item
        (
          Quantity int(5) NOT NULL,
          Cart_id VARCHAR(255) NOT NULL,
          Product_id VARCHAR(255) NOT NULL,
          FOREIGN KEY(Cart_id) REFERENCES Cart(id),
          FOREIGN KEY(Product_id) REFERENCES Product(id),
          Primary key(Cart_id, Product_id)
        );`,
      `CREATE TABLE  if not exists purchased
        ( 
          Quantity int(5) NOT NULL,
          date varchar(255) not null,
          Product_id varchar(255) NOT NULL  ,
          FOREIGN KEY (Product_id) REFERENCES Product(id),
          Customer_id varchar(255) NOT NULL  ,
          FOREIGN KEY (Customer_id) REFERENCES Customer(id),
          Primary key(Customer_id, Product_id,date)
        );`
    ]
    queries.forEach(query => connection.query(query))
  });
});
module.exports = connection;
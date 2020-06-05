const sql = require("./db.js");
const { v1: uuidv1 } = require('uuid');
const Product = {};
Product.getAll = result => {
    sql.query(`SELECT * FROM Product`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};
Product.getbyid = (id, result) => {
    sql.query(`SELECT * FROM Product where id='${id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res[0]);
    });
};
Product.add = (user, product, result) => {
    const product_id = uuidv1().toString();
    sql.query(`insert into product values 
    ('${product_id}',
    '${product.type}',
    '${product.image}',
    ${product.cost},
    ${product.quantity},
    '${product.name}',
    '${user.id}'
    );`,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            result(null, res);
        });
};
Product.addtocart = (req, result) => {
    console.log("fd")
    if (req.isAuthenticated()) {
        sql.query(`select * from cart_item where product_id='${req.params.id}' and cart_id = '${req.user.cart_id}'`, (err, product) => {
            if (err) result(err, null);
            else {
                console.log(product, req.user);
                if (product.length == 0) {
                    sql.query(`insert into cart_item values 
                    (${req.body.quantity},
                    '${req.user.Cart_id}',
                    '${req.params.id}'
                    );`, (err, res) => {
                        if (err) result(err, null);
                        else result(null, res);
                    })
                }
                else {


                }
            }
        })
    }
};
Product.getcart = (req, result) => {
    cart_id = req.user.cart_id || req.cart;
    if (cart_id) {
        sql.query(`SELECT product_id FROM cart_item where cart_id='${cart_id}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            result(null, res);
        });
    }
    else {
        result(null, [])
    }
};
module.exports = Product;
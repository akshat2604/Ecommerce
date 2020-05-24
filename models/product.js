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
        console.log("Products: ", res);
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
        console.log("Products: ", res[0]);
        result(null, res[0]);
    });
};
Product.add = (product, result) => {
    const product_id = uuidv1().toString();
    sql.query(`insert into product values 
    ('${product_id}',
    '${product.type}',
    ${product.cost},
    ${product.quantity});`,
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
    sql.query(`select * from cart_item where `)
    sql.query(`insert into cart_item values 
    (${req.quantity},
    '${Date.now().toString()}',
    '${req.user.cart_id}',
    '${req.params.id}'
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

module.exports = Product;
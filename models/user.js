const { v1: uuidv1 } = require('uuid');
const sql = require("./db.js"),
    bcrypt = require('bcryptjs'),
    User = {};
User.register = async (newCustomer, result) => {
    const cart_id = uuidv1().toString();
    const customer_id = uuidv1().toString();
    console.log(newCustomer)
    const password = await bcrypt.hash(newCustomer.password, 8);
    try {
        sql.query(`insert into cart values('${cart_id}');`, (err, res) => {
            if (err) result(err, null);
            else {
                sql.query(`insert into customer values(
                '${customer_id}',
                '${newCustomer.email}',
               ' ${newCustomer.name}',
                '${cart_id}');`, (err, res) => {
                    if (err) {
                        result(err, null);
                    }
                    else {
                        sql.query(`insert into password values('${password}','${customer_id}');`);
                        delete newCustomer.password;
                        result(null, newCustomer)
                    }
                });
            }
        });
    }
    catch (e) {
        sql.query(`delete * from cart where id='${cart_id}'`);
        sql.query(`delete * from customer where id='${customer_id}'`);
        sql.query(`delete *  from password  where customer_id='${customer_id}'`);
        result(e, null);
    }
};
User.login = async (customer, result) => {
    try {
        sql.query(`select * from customer where email='${customer.email}'`, (err, user) => {
            if (err) result(err, null);
            else {
                if (user.length != 0) {
                    sql.query(`select customer_id from password where customer_id='${user[0].id}'`, (err, resi) => {
                        if (err) result(err, null);
                        else {
                            if (resi.length != 0) {
                                result(null, user)
                            }
                        }
                    });
                }
            }
        });
    }
    catch (e) {
        res.send(501).send(e);
    }
};
User.logout = async (req, result) => {
};
User.logoutofall = async (req, result) => {

};
module.exports = User;

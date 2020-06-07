const { v1: uuidv1 } = require('uuid');
const sql = require("./db.js"),
    bcrypt = require('bcryptjs'),
    User = {};
User.register = async (newCustomer, result) => {
    const cart_id = uuidv1().toString();
    const customer_id = uuidv1().toString();
    const password = await bcrypt.hash(newCustomer.password, 8);
    try {
        sql.query(`insert into cart values('${cart_id}');`, (err, res) => {
            if (err) result(err, null);
            else {
                sql.query(`insert into customer values(
                '${customer_id}',
                '${newCustomer.email}',
                '${newCustomer.name}',
                '${newCustomer.number}',
                '${newCustomer.pincode}',
                '${newCustomer.address}',
                '${cart_id}',
                0);`, (err, res) => {
                    if (err) {
                        result(err, null);
                    }
                    else {
                        sql.query(`insert into password values('${password}','${customer_id}');`);
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
User.seller_register = async (newCustomer, result) => {
    if (newCustomer.secret == "admin") {
        const cart_id = uuidv1().toString();
        const customer_id = uuidv1().toString();
        const password = await bcrypt.hash(newCustomer.password, 8);
        try {
            sql.query(`insert into cart values('${cart_id}');`, (err, res) => {
                if (err) result(err, null);
                else {
                    sql.query(`insert into customer values(
                '${customer_id}',
                '${newCustomer.email}',
               ' ${newCustomer.name}',
                '${newCustomer.number}',
                '${newCustomer.pincode}',
                '${newCustomer.address}',
                '${cart_id}',
                1);`, (err, res) => {
                        if (err) {
                            result(err, null);
                        }
                        else {
                            sql.query(`insert into password values('${password}','${customer_id}');`);

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
    }
    else {
        result("Invalid secret key", null)
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
    req.logoutofall();
};
User.checkout = async (req, result) => {
    const cart_id = req.user.Cart_id || req.cart;
    if (cart_id) {
        sql.query(`SELECT * FROM cart_item where cart_id='${cart_id}'`, async (err, reso) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                if (reso.length != 0) {
                    await reso.forEach(async (res, i) => {
                        sql.query(`Insert into purchased values(
                            ${res.Quantity},
                            '${Date.now()}',
                            '${res.Product_id}',
                            '${req.user.id}'
                           );`, async (err, resi) => {
                            if (err) {
                                console.log("error: ", err);
                                result(null, err);
                                return;
                            }
                            else {
                                if (i == reso.length - 1) {
                                    sql.query(`DELETE FROM cart_item where Cart_id='${cart_id}'`, async (err, reso) => {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                            return;
                                        }
                                        else {
                                            return result(null, true)
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
                else {
                    result("Empty cart", null)
                }
            }
        });
    }
};
User.update = async (req, result) => {
    var newCustomer = req.body;
    sql.query(`update customer set 
    email = '${newCustomer.email}',
    Name= '${newCustomer.name}',
    phone_number='${newCustomer.number}',
    pincode   ='${newCustomer.pincode}',
    address  = '${newCustomer.address}'
    where id = '${req.user.id}';`, async (err, res) => {
        if (err) { result(err, null); }
        else {
            const password = await bcrypt.hash(newCustomer.password, 8);
            sql.query(`update password set password='${password}' where customer_id='${req.user.id}'`, (err, res) => {
                if (err) { result(err, null); }
                else {
                    result(null, res);
                }
            })

        }

    })

};
User.previous = async (req, result) => {
    const productso = [];
    sql.query(`SELECT * FROM purchased where customer_id='${req.user.id}'`, async (err, reso) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            if (reso.length != 0) {
                await reso.forEach(async (res, i) => {
                    sql.query(`SELECT * FROM product where id='${res.Product_id}'`, async (err, resi) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                        }
                        else {
                            const curr = resi[0];
                            productso.push({ curr, res });
                            if (productso.length == reso.length) {
                                return result(null, productso)
                            }
                        }
                    });
                });
            }
            else {
                result("No previous Order", null)
            }
        }
    });
};
User.sells = async (req, result) => {
    const productso = [];
    sql.query(`SELECT * FROM product where seller_id='${req.user.id}'`, async (err, reso) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            if (reso.length != 0) {
                let l = 0;
                await reso.forEach(async (res, i) => {
                    sql.query(`SELECT * FROM purchased where product_id='${res.id}';`, async (err, resi) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                        }
                        else {

                            const curr = resi[0];
                            l++;
                            if (curr != null) {
                                productso.push({ curr, res });
                            }
                            if (l == reso.length) {
                                return result(null, productso)
                                //console.log(productso)
                            }

                        }
                    });
                });
            }
            else {
                result("No Sells Yet", null)
            }
        }
    });
};
module.exports = User;

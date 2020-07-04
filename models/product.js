const sql = require("./db.js");
const { v1: uuidv1 } = require('uuid');
const Product = {};
Product.getAll = result => {
    sql.query(`SELECT * FROM Product where isvisible=1 limit 12`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null)
            return;
        }
        result(null, res);
    });
};
Product.getbyid = (req, id, result) => {
    sql.query(`SELECT * FROM Product where id='${id}'`, (err, resoo) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            const product = resoo[0];
            const productso = [];
            if (req.isAuthenticated()) {
                sql.query(`SELECT * FROM product where seller_id='${product.seller_id}' and name='${product.name}'`, async (err, reso) => {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    }
                    else {
                        if (reso.length != 0) {
                            await reso.forEach((res, i) => {
                                sql.query(`SELECT * FROM purchased where product_id='${res.id}' and customer_id='${req.user.id}';`, async (err, resi) => {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                        return;
                                    }
                                    else {
                                        await resi.forEach((resooo, j) => {
                                            const curr = resooo;
                                            if (curr)
                                                productso.push({ curr, res });
                                            if (i == reso.length - 1 && (j == resi.length - 1))
                                                return result(null, { product, productso })
                                        });
                                        if (resi.length == 0 && i == reso.length - 1)
                                            return result(null, { product, productso })
                                    }
                                });
                            });
                        }
                        else {
                            result(null, { product, productso })
                        }
                    }
                });
            }
            else {
                result(null, { product, productso })
            }
        }
    });
};
Product.add = (user, product, result) => {
    const product_id = uuidv1().toString();
    sql.query(`insert into product values 
    ('${product_id}',
    '${product.type}',
    1,
    '${product.image}',
    ${product.cost},
    ${product.quantity},
    '${product.name}',
    '${user.id}'
    );`,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};
Product.addtocart = (req, res, result) => {
    if (req.isAuthenticated()) {
        sql.query(`select * from product where id='${req.params.id}'`, (err, product) => {
            if (err) result(err, null);
            else {
                if (parseInt(req.body.quantity) <= product[0].Quantity) {
                    sql.query(`select * from cart_item where product_id='${req.params.id}' and cart_id = '${req.user.Cart_id}'`, (err, product) => {
                        if (err) result(err, null);
                        else {
                            if (product.length == 0) {
                                sql.query(`insert into cart_item values 
                    (${req.body.quantity},
                    '${req.user.Cart_id}',
                    '${req.params.id}'
                    );`, (err, res) => {
                                    if (err) result(err, null);
                                    else {
                                        sql.query(`update product set quantity=quantity-${req.body.quantity} where id='${req.params.id}'`, (err, resoo) => {
                                            if (err) result(err, null);
                                            else result(null, res)

                                        })
                                    }
                                })
                            }
                            else {

                                req.flash("error", "Product is already in your cart");
                                res.redirect("back");
                            }
                        }
                    })
                }
                else {
                    req.flash("error", "Selected Quantity not available Please reduce it");
                    res.redirect("back")
                }
            }
        })
    }
};
Product.getcart = async (req, result) => {
    const cart_id = req.user.Cart_id || req.cart;
    let productso = [];
    if (cart_id) {
        sql.query(`SELECT * FROM cart_item where cart_id='${cart_id}'`, async (err, reso) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                if (reso.length != 0) {
                    await reso.forEach(async (res) => {
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
                    result(null, [])
                }
            }
        });
    }
};
Product.deletefromcart = async (req, result) => {
    const cart_id = req.user.Cart_id || req.cart;
    sql.query(`SELECT * FROM cart_item where Cart_id='${cart_id}' and Product_id='${req.params.id}'`, async (err, reso) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            if (!reso || reso.length == 0) {
                return result("Product is not in your cart", null);
            }
            else {
                sql.query(`DELETE FROM cart_item where Cart_id='${cart_id}' and Product_id='${req.params.id}'`, async (err, resoo) => {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    }
                    else {
                        sql.query(`update product set quantity=quantity+${reso[0].Quantity} where id='${req.params.id}'`, (err, resoo) => {
                            console.log("error: ", err);

                            if (err) result(err, null);
                            else result(null, reso)
                        })
                    }
                });
            }
        }

    });
}
Product.my = (req, result) => {
    sql.query(`SELECT * FROM Product where seller_id ='${req.user.id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null)
            return;
        }
        result(null, res);
    });
};
Product.delete = (req, result) => {
    sql.query(`SELECT * FROM Product where seller_id ='${req.user.id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null)
            return;
        }
        else {
            if (res.length != 0) {
                sql.query(`update product set isvisible=0 where id='${req.params.id}'`, (err, resoo) => {
                    if (err) result(err, null);
                    else result(null, resoo)
                })
            }
            else {
                result("You have no such Product", null);
            }
        }
    });
};
Product.edit = (req, result) => {
    sql.query(`SELECT * FROM Product where id='${req.params.id}' and seller_id='${req.user.id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            if (res.length != 0) {
                if (req.body.cost == res.Cost) {
                    sql.query(`update product set 
                type='${req.body.type}',
                image='${req.body.image}',
                quantity=${req.body.image},
                name='${req.body.name}'
                where id='${req.params.id}'`, (err, resoo) => {
                        if (err) result(err, null);
                        else {
                            result(null, resoo);
                        }
                    })
                }
                else {
                    const product = req.body;
                    const product_id = uuidv1().toString();
                    sql.query(`insert into product values 
                        ('${product_id}',
                         '${product.type}',
                            1,
                            '${product.image}',
                             ${product.cost},
                            ${product.quantity},
                            '${product.name}',
                            '${req.user.id}'
                        );`,
                        (err, res) => {
                            if (err) {
                                result(err, null);
                                return;
                            }
                            else {
                                sql.query(`update product set isvisible=0 where id='${req.params.id}'`, (err, resoo) => {
                                    if (err) result(err, null);
                                    else result(null, resoo)
                                })
                            }
                        });
                }
            }
            else {
                result("You have no such Product", null);
            }
        }
    });
}
Product.search = (req, res, result) => {
    const arr = req.query.search.trim().split(' ');
    const products = [];
    if (arr.length == 0) {
        req.flash("error", "Please enter a search query");
        return res.redirect("/");
    }
    arr.forEach((product, i) => {
        if (product != '') {
            sql.query(`SELECT * FROM Product where name like'%${product}%' or type='%${product}% ';`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                else {
                    products.push(...res);
                    if (i == arr.length - 1) {
                        return result(null, products);
                    }
                }
            });
        }
        else if (arr.length == 1) {
            return result(null, []);
        }
    });
}
/* Product.addt = (user, product, result) => {
    const product_id = uuidv1().toString();
    sql.query(`insert into product values 
    ('${product_id}',
    '${product.type}',
    1,
    '${product.image}',
    ${product.cost},
    ${product.quantity},
    '${product.name}',
    '${user.id}'
    );`,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                const product_id = uuidv1().toString();

                sql.query(`insert into product values 
                ('${product_id}',
                '${product.type}',
                1,
                '${product.image}',
                ${product.cost},
                ${product.quantity},
                '${product.name}',
                '${user.id}'
                );`,
                    (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                        }
                        else {
                            const product_id = uuidv1().toString();

                            sql.query(`insert into product values 
                            ('${product_id}',
                            '${product.type}',
                            1,
                            '${product.image}',
                            ${product.cost},
                            ${product.quantity},
                            '${product.name}',
                            '${user.id}'
                            );`,
                                (err, res) => {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                        return;
                                    }
                                    else {
                                        const product_id = uuidv1().toString();

                                        sql.query(`insert into product values 
                                        ('${product_id}',
                                        '${product.type}',
                                        1,
                                        '${product.image}',
                                        ${product.cost},
                                        ${product.quantity},
                                        '${product.name}',
                                        '${user.id}'
                                        );`,
                                            (err, res) => {
                                                if (err) {
                                                    console.log("error: ", err);
                                                    result(err, null);
                                                    return;
                                                }
                                                else {
                                                    const product_id = uuidv1().toString();

                                                    sql.query(`insert into product values 
                                                    ('${product_id}',
                                                    '${product.type}',
                                                    1,
                                                    '${product.image}',
                                                    ${product.cost},
                                                    ${product.quantity},
                                                    '${product.name}',
                                                    '${user.id}'
                                                    );`,
                                                        (err, res) => {
                                                            if (err) {
                                                                console.log("error: ", err);
                                                                result(err, null);
                                                                return;
                                                            }
                                                            else {
                                                                const product_id = uuidv1().toString();

                                                                sql.query(`insert into product values 
                                                                ('${product_id}',
                                                                '${product.type}',
                                                                1,
                                                                '${product.image}',
                                                                ${product.cost},
                                                                ${product.quantity},
                                                                '${product.name}',
                                                                '${user.id}'
                                                                );`,
                                                                    (err, res) => {
                                                                        if (err) {
                                                                            console.log("error: ", err);
                                                                            result(err, null);
                                                                            return;
                                                                        }
                                                                        else {
                                                                            const product_id = uuidv1().toString();

                                                                            sql.query(`insert into product values 
                                                                            ('${product_id}',
                                                                            '${product.type}',
                                                                            1,
                                                                            '${product.image}',
                                                                            ${product.cost},
                                                                            ${product.quantity},
                                                                            '${product.name}',
                                                                            '${user.id}'
                                                                            );`,
                                                                                (err, res) => {
                                                                                    if (err) {
                                                                                        console.log("error: ", err);
                                                                                        result(err, null);
                                                                                        return;
                                                                                    }
                                                                                    else {
                                                                                        const product_id = uuidv1().toString();

                                                                                        sql.query(`insert into product values 
                                                                                        ('${product_id}',
                                                                                        '${product.type}',
                                                                                        1,
                                                                                        '${product.image}',
                                                                                        ${product.cost},
                                                                                        ${product.quantity},
                                                                                        '${product.name}',
                                                                                        '${user.id}'
                                                                                        );`,
                                                                                            (err, res) => {
                                                                                                if (err) {
                                                                                                    console.log("error: ", err);
                                                                                                    result(err, null);
                                                                                                    return;
                                                                                                }

                                                                                                else {
                                                                                                    const product_id = uuidv1().toString();

                                                                                                    sql.query(`insert into product values 
                                                                                                    ('${product_id}',
                                                                                                    '${product.type}',
                                                                                                    1,
                                                                                                    '${product.image}',
                                                                                                    ${product.cost},
                                                                                                    ${product.quantity},
                                                                                                    '${product.name}',
                                                                                                    '${user.id}'
                                                                                                    );`,
                                                                                                        (err, res) => {
                                                                                                            if (err) {
                                                                                                                console.log("error: ", err);
                                                                                                                result(err, null);
                                                                                                                return;
                                                                                                            }
                                                                                                            else {
                                                                                                                const product_id = uuidv1().toString();

                                                                                                                sql.query(`insert into product values 
                                                                                                                ('${product_id}',
                                                                                                                '${product.type}',
                                                                                                                1,
                                                                                                                '${product.image}',
                                                                                                                ${product.cost},
                                                                                                                ${product.quantity},
                                                                                                                '${product.name}',
                                                                                                                '${user.id}'
                                                                                                                );`,
                                                                                                                    (err, res) => {
                                                                                                                        if (err) {
                                                                                                                            console.log("error: ", err);
                                                                                                                            result(err, null);
                                                                                                                            return;
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            result(null, res);

                                                                                                                        }
                                                                                                                    });
                                                                                                            }
                                                                                                        });
                                                                                                }
                                                                                            });
                                                                                    }
                                                                                });
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
                        }
                    });
            }
        });
}; */
module.exports = Product;
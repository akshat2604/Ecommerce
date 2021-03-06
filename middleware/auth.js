const sql = require("../models/db");
const auth = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect(`/login?origin=${req.originalUrl}`);
};
const seller = async (req, res, next) => {
    if (req.isAuthenticated()) {
        sql.query(`select isseller from customer where email='${req.user.email}'`, (err, user) => {
            if (user[0].isseller == 1)
                return next();
        });
    }
    else {
        req.flash("error", "Please Login First as seller ");
        res.redirect(`/login`);
    }
}
const notseller = async (req, res, next) => {
    if (req.isAuthenticated()) {
        sql.query(`select isseller from customer where email='${req.user.email}'`, (err, user) => {
            if (user[0].isseller == 0)
                return next();
            else {
                req.flash("error", "A Seller cannot buy a product");
                res.redirect("/");
            }
        });
    }
    else {
        req.flash("error", "Please Login First as Customer ");
        res.redirect(`/login`);
    }
}
module.exports = { auth, seller, notseller };
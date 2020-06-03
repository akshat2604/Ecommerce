const sql = require("../models/db");
const auth = async (req, res, next) => {
    console.log("middleware")
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect(`/login?origin=${req.originalUrl}`);
}

module.exports = auth;
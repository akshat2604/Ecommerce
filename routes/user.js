const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const user = require("../controllers/user"),
    passport = require("passport");

router.post('/register', user.register);
router.post('/seller/register', user.seller_register);
router.post('/login', passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Loggedin Successfully'
}), function (req, res) {
    res.redirect("/")
}
);
router.get('/register', user.registerform);
router.get('/seller/register', user.seller_registerform);
router.get('/login', user.loginform);
router.get('/logout', auth, user.logout);
router.post('/logoutofall', auth, user.logoutofall);
module.exports = router;

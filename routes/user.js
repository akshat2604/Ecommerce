const express = require("express");
const { auth, seller } = require("../middleware/auth")
const router = express.Router();
const user = require("../controllers/user"),
    passport = require("passport");

router.post('/register', user.register);
router.post('/login', passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Loggedin Successfully'
}), function (req, res) {
    console.log("return to", req.session.returnTo)
    res.redirect(req.session.returnTo);
}
);

router.get('/register', user.registerform);
router.get('/edit', auth, user.edit);
router.put('/edit', auth, user.update);
router.get('/checkout', auth, user.checkout);
router.get('/sells', seller, user.sells);
router.get('/previous', auth, user.previous);
router.get('/seller/register', user.seller_registerform);
router.post('/seller/register', user.seller_register);
router.get('/login', user.loginform);
router.get('/logout', user.logout);
module.exports = router;

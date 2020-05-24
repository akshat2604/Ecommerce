const express = require("express");
const auth= require("../middleware/auth")
const router = express.Router();
const user= require("../controllers/user");
router.post('/register', user.register);
router.post('/login',user.login);
router.post('/logout',auth,user.logout);
router.post('/logoutofall',auth,user.logoutofall);
module.exports=router;
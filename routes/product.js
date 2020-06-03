const express = require("express");
const {auth} = require('../middleware/auth');
const router = express.Router();
const product = require("../controllers/product");
router.get('/', product.findAll);
router.post('/seller/add', product.add)
router.get('/:id', product.getbyid);
module.exports = router;
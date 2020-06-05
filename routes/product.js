const express = require("express");
const { auth, seller, notseller } = require('../middleware/auth');
const router = express.Router();
const product = require("../controllers/product");
router.get('/', product.findAll);
router.get('/add', seller, product.addform)
router.post('/add', seller, product.add);
router.get('/product/:id', product.getbyid);
router.get('/cart', product.getcart);
router.post('/:id/addtocart', notseller, product.addtocart);
module.exports = router;
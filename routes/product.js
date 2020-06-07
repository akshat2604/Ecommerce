const express = require("express");
const { auth,seller, notseller } = require('../middleware/auth');
const router = express.Router();
const product = require("../controllers/product");
router.get('/', product.findAll);
router.get('/add', seller, product.addform)
router.post('/add', seller, product.add);
router.get('/my', seller, product.my);
router.put('/product/:id/edit',seller,product.edit)
router.delete('/product/:id/delete', auth, product.deletefromcart);
router.delete('/product/:id', seller, product.delete);
router.get('/product/:id/edit', seller, product.editform);
router.get('/product/:id', product.getbyid);
router.get('/cart', notseller, product.getcart);
router.post('/:id/addtocart', auth,notseller, product.addtocart);
module.exports = router;
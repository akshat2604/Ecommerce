const express = require("express");
const auth = require('../middleware/auth');
const router = express.Router();
const product = require("../controllers/product");
router.get('/', product.findAll);
router.post('/add', auth, product.add)
router.get('/:id', product.getbyid);
router.get('/addtocart/:id',auth,product.addtocart);
module.exports = router;
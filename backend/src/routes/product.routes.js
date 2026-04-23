const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getBrands, getCategories } = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/:id', getProduct);

module.exports = router;

// Export brand/category handlers for use in index.js
module.exports.getBrands = getBrands;
module.exports.getCategories = getCategories;

const express = require('express');
const router = express.Router();

//get product model
const Product = require('../models/product');


router.get('/:slug', (req, res) => {

    Product.find({ catagory: req.params.slug }, (err, products) => {
        if (err) {
            console.log('error geting data to index');
        } else {
            var productChucks = [];
            var chunckSize = 3;
            for (var i = 0; i < products.length; i += chunckSize) {
                productChucks.push(products.slice(i, i + chunckSize));
            }
            res.render('product/products', {
                title: req.params.slug,
                catTitle: req.params.slug,
                products: productChucks
            });
        }
    });
});

//get single product
router.get('/product/:slug', (req, res) => {
    Product.findOne({ slug: req.params.slug }, (err, product) => {
        if (err) {
            console.log('error while get single product');
        } else {
            // console.log(product);
            res.render('product/singleProduct', {
                title: req.params.slug,
                product: product
            });
        }
    });
});

module.exports = router;
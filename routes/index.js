const express = require('express');
const router = express.Router();

//get product model
const Product = require('../models/product');


router.get('/', (req, res) => {

    var result = Product.find().limit(9);
    result.exec((err, products) => {
        if (err) {
            console.log('error geting data to index');
        } else {
            var productChucks = [];
            var chunckSize = 3;
            for (var i = 0; i < products.length; i += chunckSize) {
                productChucks.push(products.slice(i, i + chunckSize));
            }
            res.render('index', {
                title: '-Chair Shop',
                products: productChucks
            });
        }
    });
});

module.exports = router;


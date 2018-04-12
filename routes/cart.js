const router = require('express').Router();
const mongoose = require('mongoose');

//get product model
const Product = require('../models/product');

//get product to cart
router.get('/add/:product', (req, res) => {
    var slug = req.params.product;
    console.log(slug);
    Product.findOne({ slug: slug }, (error, product) => {
        if (error) {
            console.log(error);
        }
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                quantity: 1,
                price: parseFloat(product.price).toFixed(2),
                image: '/productImages/' + product._id + '/' + product.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].quantity++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    quantity: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: '/productImages/' + product._id + '/' + product.image
                });
            }
        }

        // req.flash('success', 'Product added to cart');
        res.redirect('back');
    });
});

//get checkout page
router.get('/checkout', (req, res) => {
    res.render('product/checkout', {
        title: 'Checkout',
        cart: req.session.cart
    });
});

//get update cart

var Order = require('../models/order');
//get replace order
router.get('/buynow', (req, res) => {
    var order = new Order({
        details: req.session.cart
    });
    order.save((error) => {
        if(error) {
            console.log('error while saving order');
        } else {
            req.flash('success', 'Your order has been recieved');
            res.redirect('/track');
        }
    });
});


module.exports = router;
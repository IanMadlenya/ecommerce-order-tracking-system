const express = require('express');
const router = express.Router();


// get order model
const Order = require('../models/order');
//get product model
const TrackingInfo = require('../models/trackinginfo');

//get orders
router.get('/', (req, res) => {
    Order.find((err, orders) => {
        if (err) {
            console.log('error while geting orders');
        } else {
            res.render('staff/orders', {
                title: "Total orders",
                orders: orders
            });
        }
    });
});

//get confirm orders
router.get('/confirm-order/:id', (req, res) => {
    var id = req.params.id;
    var trackinginfo = new TrackingInfo({
        order_id: id,
        confirmOrder: 'yes',
        confirmDate: new Date()
    });
    trackinginfo.save((error) => {
        if (error) {
            console.log('error while confiem order');
        } else {
            req.flash('success', 'Order is confirmed');
            res.render('staff/proccessingOrder', {
                title: 'Confirm Proccessing',
                id: id
            });
        }
    });
});

//post complete proccesing
router.post('/complete-proccess', (req, res) => {
    var id = req.body.proccessorder;
    TrackingInfo.findOne({ order_id: id }, (err, info) => {
        info.proccesingOrder = "yes";
        info.processDate = new Date();
        info.save((err) => {
            if (!err) {
                req.flash('success', 'Order proccessed successfully');
                res.render('staff/checkQuality', {
                    title: 'Check Quality',
                    id: id
                });
            }
        });
    });

});

//post complete checking
router.post('/check-quality', (req, res) => {
    var id = req.body.checkquality;
    TrackingInfo.findOne({ order_id: id }, (err, info) => {
        info.checkQuality = "yes";
        info.checkDate = new Date();
        info.save((err) => {
            if (!err) {
                req.flash('success', 'Order is ready for shippment');
                res.redirect('/track/addtracking');
            }
        });
    });

});

module.exports = router;
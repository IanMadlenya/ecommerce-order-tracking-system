const express = require('express');
const router = express.Router();

//get trackinginfo model
const TrackingInfo = require('../models/trackinginfo');
// get order model
const Order = require('../models/order');

//get tracking page
router.get('/', (req, res) => {
    Order.find({}, (error, info) => {
        if (error) {
            console.log('error while geting tracking info');
        } else {
            res.render('user/tracking', {
                title: 'Track',
                orders: info
            });
        }
    });

});


//post tracking info to user
router.get('/order/:id', (req, res) => {

    orderId = req.params.id;
    TrackingInfo.findOne({ order_id: orderId }, (err, info) => {
        if (err) {
            console.log('error while geting tracking info');
        }
        if (!info) {
            req.flash('danger', 'Invalid order id or order is not confirmed yet!!!');
            res.redirect('/track');
        } else {
            res.render('user/trackingMap', {
                title: 'Track',
                info: info,
                orderId: orderId
            });
        }
    });
});


//get delevery man start tracking
router.get('/addtracking', (req, res) => {
    res.render('deleveryman/addTracking', {
        title: 'Add Tracking'
    });
});

//post add track
router.post('/addtracking', (req, res) => {
    var orderId = req.body.orderid;
    res.render('deleveryman/starttracking', {
        title: 'Start tracking',
        orderId: orderId
    });
});

//send location to db from delivery man
router.post('/addtracking/sending', (req, res) => {
    var obj = req.body;
    TrackingInfo.findOne({ order_id: obj.orderid }, (err, trackinginfo) => {
        trackinginfo.lat = obj.lat;
        trackinginfo.long = obj.lng;
        trackinginfo.shipping = obj.shipping;
        trackinginfo.shipDate = new Date();
        trackinginfo.save((err) => {
            if (err) {
                console.log('error saving lat lng');
            } else {
                console.log('succefully save lat long');
            }
        });
    });
    res.send(req.body);
});

module.exports = router;
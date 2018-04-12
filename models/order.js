const mongoose = require('mongoose');


const Order = mongoose.Schema({
    details: {
        type: String
    }
},{collection: 'orders'});

var CustomerOrder = module.exports = mongoose.model('order', Order);
const mongoose = require('mongoose');


const TrackingInfo = mongoose.Schema({
    order_id: {
        type: String, required: true
    },
    lat: {
        type: String
    },
    long: {
        type: String
    },
    confirmOrder: {
        type: String
    },
    confirmDate: {
        type: String
    },
    proccesingOrder: {
        type: String
    },
    processDate: {
        type: String
    },
    checkQuality: {
        type: String
    },
    checkDate: {
        type: String
    },
    shipping: {
        type: String
    },
    shipDate: {
        type: String
    },
    delivered: {
        type: String
    }


},{collection: 'trackinginfo'});

var Track = module.exports = mongoose.model('TrackingInfo', TrackingInfo);
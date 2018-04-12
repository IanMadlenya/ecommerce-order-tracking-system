const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({
    title: {
        type: String, required: true
    },
    slug: {
        type: String
    },
    desc: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }

});

const Product = module.exports = mongoose.model('product', ProductSchema);
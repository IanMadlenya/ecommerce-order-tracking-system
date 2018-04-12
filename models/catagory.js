const mongoose = require('mongoose');


const CatagorySchema = mongoose.Schema({
    title: {
        type: String, required: true
    },
    slug: {
        type: String
    }
},{collection: 'catagories'});

const Page = module.exports = mongoose.model('Catagory', CatagorySchema);
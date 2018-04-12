const mongoose = require('mongoose');


const PageSchema = mongoose.Schema({
    title: {
        type: String, required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }

}, {collection: 'pages'});

const Page = module.exports = mongoose.model('Page', PageSchema);
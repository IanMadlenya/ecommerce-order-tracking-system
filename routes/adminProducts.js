const router = require('express').Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

//get product model
const Product = require('../models/product');
//get catagory model
const Catagory = require('../models/catagory');

//get products page
router.get('/', (req, res, next) => {
    var count;
    Product.count((err, c) => {
        count = c;
    });
    Product.find((err, products) => {
        res.render('admin/products', {
            products: products,
            count: count,
            title: "Admin Products"
        });
    });
});

// get add product
router.get('/add-product', (req, res, next) => {
    var title = "";
    var desc = "";
    var price = "";

    Catagory.find((err, catagories) => {
        res.render('admin/addProduct', {
            title: title,
            desc: desc,
            catagories: catagories,
            price: price
        });
    });
});

// post add product
router.post('/add-product', (req, res, next) => {

    var imageFile = typeof req.files.image != "undefined" ? req.files.image.name : "";

    req.checkBody('title', 'Title can not be empty').isLength({ min: 3 });
    req.checkBody('desc', 'Description should be 10 chars').isLength({ min: 10 });
    req.checkBody('price', 'Price cant not be empty').isDecimal();
    // req.checkBody('image', "you must upload an image").isImage(imageFile);

    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var catagory = req.body.catagory;

    var errors = req.validationErrors();

    if (errors) {
        Catagory.find((err, catagories) => {
            res.render('admin/addProduct', {
                errors: errors,
                title: title,
                desc: desc,
                catagories: catagories,
                price: price
            });
        });
    }
    else {
        Product.findOne({ slug: slug }, (err, product) => {
            if (product) {
                req.flash('danger', 'Product title exits please chose another one');
                Catagory.find((err, catagories) => {
                    res.render('admin/addProduct', {
                        title: title,
                        desc: desc,
                        catagories: catagories,
                        price: price
                    });
                });
            } else {
                var price2 = parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    catagory: catagory,
                    image: imageFile

                });
                product.save((err) => {
                    if (err) {
                        return console.log(err);
                    }

                    mkdirp('public/productImages/' + product._id, (err) => {
                        return console.log(err);
                    });

                    mkdirp('public/productImages/' + product._id + '/gallery', (err) => {
                        return console.log(err);
                    });

                    mkdirp('public/productImages/' + product._id + '/gallery/thumbs', (err) => {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/productImages/' + product._id + '/' + imageFile;

                        productImage.mv(path, (err) => {
                            return console.log(err);
                        });
                    }
                    req.flash('success', 'Product added successfully');
                    res.redirect('/admin/products');
                });
            }
        });
    }


});

// //get edit product
// router.get('/edit-product/:id', (req, res) => {
//     var errors;

//     if (req.session.errors) {
//         errors = null;
//     }

//     Catagory.find((err, catagories) => {

//         Product.findById(req.params.id, (err, product) => {
//             if (err) {
//                 return console.log(err);
//                 res.redirect('/admin/products');
//             } else {
//                 var galleryDir = 'public/productImages/' + product._id + '/gallery';
//                 var galleryImages = null;
//                 fs.readdir(galleryDir, (err, files) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         galleryImages = files;
//                         res.render('admin/editProduct', {
//                             id: product._id,
//                             title: product.title,
//                             errors: errors,
//                             desc: product.desc,
//                             catagories: catagories,
//                             catagory: product.catagory.replace(/\s+/g, '-').toLowerCase,
//                             price: product.price,
//                             galleryImages: galleryImages
//                         });
//                     }
//                 });
//             }
//         });
//     });


// });

// post edit page
// router.post('/edit-page/:id', (req, res, next) => {
//     req.checkBody('title', 'Title can not be empty').notEmpty();
//     req.checkBody('content', 'Content should be 10 chars').isLength({ min: 10 });

//     var title = req.body.title;
//     var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
//     var content = req.body.content;
//     var id = req.params.id;

//     if (slug == "") {
//         slug = title.replace(/\s+/g, '-').toLowerCase();
//     }

//     var errors = req.validationErrors();

//     if (errors) {
//         console.log(errors);
//         res.render('admin/editPage', {
//             errors: errors,
//             title: title,
//             slug: slug,
//             content: content,
//             id: id
//         });
//     }
//     else {
//         Page.findOne({ slug: slug, _id: { '$ne': id } }, (err, page) => {
//             if (page) {
//                 req.flash('danger', 'Page slug exits please chose another one');
//                 res.render('admin/editPage', {
//                     title: title,
//                     slug: slug,
//                     content: content,
//                     id: id
//                 });
//             } else {
//                 Page.findById(id, (err, page) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     page.title = title;
//                     page.slug = slug;
//                     page.content = content;
//                     page.save((err) => {
//                         if (err) {
//                             return console.log(err);
//                         }
//                         req.flash('success', 'Page edited successfully');
//                         res.redirect('/admin/pages/edit-page/' + id);
//                     });
//                 });
//             }
//         });
//     }


// });


// get delete product
router.get('/delete-product/:id', (req, res, next) => {
    Product.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Product deleted successfully');
        res.redirect('/admin/products');
    });
});


module.exports = router;
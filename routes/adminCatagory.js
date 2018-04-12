const router = require('express').Router();
const mongoose = require('mongoose');

//get catagory model
const Catagory = require('../models/catagory');

//get catagories
router.get('/', (req, res, next) => {
    Catagory.find((err, catagories) => {
        if (err) {
            return console.log(err);
        }
        res.render('admin/catagories', {
            title: 'Catagories',
            catagories: catagories
        });
    });
});

// get add catagory
router.get('/add-catagory', (req, res, next) => {
    res.render('admin/addCatagory', {
        title: 'Add Catagory'
    });
});

// post add catagory
router.post('/add-catagory', (req, res, next) => {
    req.checkBody('title', 'Title can not be empty').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/addPage', {
            errors: errors,
            title: title
        });
    }
    else {
        Catagory.findOne({ slug: slug }, (err, catagory) => {
            if (catagory) {
                req.flash('danger', 'Catagory exits please chose another one');
                res.render('admin/addCatagory', {
                    title: title
                });
            } else {
                var catagory = new Catagory({
                    title: title,
                    slug: slug
                });
                catagory.save((err) => {
                    if (err) {
                        return console.log(err);
                    }

                    Catagory.find((err, catagories) => {
                        req.app.locals.catagories = catagories;
                    });

                    req.flash('success', 'Catagory added successfully');
                    res.redirect('/admin/catagories');
                });
            }
        });
    }


});

//get edit catagory
router.get('/edit-catagory/:slug', (req, res) => {
    Catagory.findOne({ slug: req.params.slug }, (err, catagory) => {
        if (err) {
            console.log(err);
        }
        res.render('admin/editCatagory', {
            title: catagory.title,
            id: catagory._id
        });
    });
});

// post edit catagory
router.post('/edit-catagory', (req, res, next) => {
    req.checkBody('title', 'Title can not be empty').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/editCatagory', {
            errors: errors,
            title: title,
            id: id
        });
    }
    else {
        Catagory.findOne({ slug: slug, _id: { '$ne': id } }, (err, catagory) => {
            if (catagory) {
                req.flash('danger', 'Catagory exits please chose another one');
                res.render('admin/editCatagory', {
                    title: title,
                    id: id
                });
            } else {
                Catagory.findById(id, (err, catagory) => {
                    if (err) {
                        console.log(err);
                    }
                    catagory.title = title;
                    catagory.slug = slug;
                    catagory.save((err) => {
                        if (err) {
                            return console.log(err);
                        }
                        Catagory.find((err, catagories) => {
                            req.app.locals.catagories = catagories;
                        });
                        req.flash('success', 'Catagory edited successfully');
                        res.redirect('/admin/catagories/edit-catagory/' + catagory.slug);
                    });
                });
            }
        });
    }


});


// get delete catagory
router.get('/delete-catagory/:id', (req, res, next) => {
    Catagory.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        Catagory.find((err, catagories) => {
            req.app.locals.catagories = catagories;
         });
        req.flash('success', 'Catagory deleted successfully');
        res.redirect('/admin/catagories');
    });
});


module.exports = router;
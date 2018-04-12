const router = require('express').Router();
const mongoose = require('mongoose');

//get page model
const Page = require('../models/page');

//get pages
router.get('/', (req, res, next) => {
    Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
        res.render('admin/pages', {
            pages: pages,
            title: 'All Page'
        });
    });
});

// get add page
router.get('/add-page', (req, res, next) => {
    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/addPage', {
        title: title,
        slug: slug,
        content: content
    });
});

// post add page
router.post('/add-page', (req, res, next) => {
    req.checkBody('title', 'Title can not be empty').notEmpty();
    req.checkBody('content', 'Content should be 10 chars').isLength({ min: 10 });

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/addPage', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }
    else {
        Page.findOne({ slug: slug }, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exits please chose another one');
                res.render('admin/addPage', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save((err) => {
                    if (err) {
                        return console.log(err);
                    }
                    req.flash('success', 'Page added successfully');
                    res.redirect('/admin/pages');
                });
            }
        });
    }


});

//get edit page 
router.get('/edit-page/:id', (req, res) => {
    Page.findById(req.params.id, (err, page) => {
        if (err) {
            console.log(err);
        }
        res.render('admin/editPage', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });
});

// post edit page
router.post('/edit-page/:id', (req, res, next) => {
    req.checkBody('title', 'Title can not be empty').notEmpty();
    req.checkBody('content', 'Content should be 10 chars').isLength({ min: 10 });

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id;

    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/editPage', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    }
    else {
        Page.findOne({ slug: slug, _id: { '$ne': id } }, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exits please chose another one');
                res.render('admin/editPage', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                Page.findById(id, (err, page) => {
                    if (err) {
                        console.log(err);
                    }
                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    page.save((err) => {
                        if (err) {
                            return console.log(err);
                        }
                        req.flash('success', 'Page edited successfully');
                        res.redirect('/admin/pages/edit-page/' + id);
                    });
                });
            }
        });
    }


});


// reorder pages
router.post('/reorder-page', (req, res) => {

    var ids = req.body['id[]'];
    var count = 0;

    ids.map(id => {
        count++;
        (count => {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save();
            });
        })(count);
    });
});

// get delete page
router.get('/delete-page/:id', (req, res, next) => {
    Page.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Page deleted successfully');
        res.redirect('/admin/pages');
    });
});


module.exports = router;
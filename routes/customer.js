const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer')
const { isAuthenticated } = require('../helpers/auth');


router.get('/', isAuthenticated, async(req, res) => {
    const customers = await Customer.find()
    try {
        res.render('customers', {
            data: customers
        })
    } catch (err) {
        throw err
    }
})


router.post('/add', isAuthenticated, async(req, res) => {
    let customer = new Customer({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
    })
    try {
        customer = await customer.save()
        res.redirect('/customers')
    } catch (err) {
        throw err
    }
});

router.get('/delete/:id', isAuthenticated, async(req, res) => {
    const id = req.params.id;
    await Customer.findOneAndDelete({ _id: id }, (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});

router.get('/update/:id', isAuthenticated, async(req, res) => {
    const id = req.params.id;
    let customer = await Customer.findOne({ _id: id })
    try {
        res.render('customers_edit', {
            data: customer
        })
    } catch (err) {
        throw err;
    }
});

router.post('/edit/:id', isAuthenticated, async(req, res) => {
    const id = req.params.id;
    await Customer.findOneAndUpdate({ _id: id }, {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
    }, (err) => {
        if (err) throw err;
        res.redirect('/customers');
    })
});







module.exports = router;
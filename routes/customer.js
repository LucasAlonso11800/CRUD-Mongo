const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');

router.get('/', isAuthenticated, (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err
        conn.query('SELECT * from customer', (err, customers) => {
            if (err) res.json(err);
            res.render('customers', {
                data: customers
            })
        })
    })
});

router.post('/add', isAuthenticated, (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) throw err
        conn.query('INSERT INTO customer set ?', [data], (err, customer) => {
            if (err) throw err
            res.redirect('/customers')
        })
    })
});

router.get('/delete/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    req.getConnection((err, conn) => {
        if (err) throw err
        conn.query(`DELETE from customer WHERE id = ${id}`, (err, customer) => {
            if (err) throw err
            conn.query(`UPDATE customer SET id = id - 1 WHERE id > ${id}`)
            res.redirect('/customers')
        })
    })
});

router.get('/update/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    req.getConnection((err, conn) => {
        if (err) throw err
        conn.query(`SELECT * from customer WHERE id = ${id}`, (err, customer) => {
            if (err) throw err
            res.render('customers_edit', {
                data: customer[0]
            })
        })
    })
});

router.post('/edit/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) throw err
        conn.query('UPDATE customer SET ? WHERE id = ?', [data, id], (err, customer) => {
            if (err) throw err
            res.redirect('/customers');
        })
    })
});







module.exports = router;
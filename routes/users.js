const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('signin', {
        success: false,
        error: false
    })
});

router.post('/in', passport.authenticate('local', {
    successRedirect: '/customers',
    failureRedirect: '/users/error',
    failureFlash: true
}));

router.get('/error', (req, res) => {
    req.flash('error', 'Username and/or password incorrect')
    res.render('signin', {
        success: false,
        error: req.flash('error')
    })
});

router.get('/up', (req, res) => {
    res.render('signup', {
        error: false
    })
});

router.post('/up', async(req, res) => {
    const emailUser = await User.findOne({ email: req.body.email })
    if (emailUser) {
        req.flash('error', 'Email already in use')
        res.render('signup', {
            error: req.flash('error')
        })
    };

    let user = new User({
        email: req.body.email,
        password: req.body.password
    })
    user.password = await user.encryptPassword(req.body.password);
    try {
        user = await user.save();
        res.redirect('/users/first');
    } catch (err) {
        console.log(err)
    }
});

router.get('/first', (req, res) => {
    req.flash('success', 'You have successfully signed up. You can now log in')
    res.render('signin', {
        success: req.flash('success'),
        error: false
    })
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;
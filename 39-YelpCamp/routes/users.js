const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
.get((req, res) => { res.render('users/register') })
.post(catchAsync(users.renderRegister));

router.route('/login')
.get(users.renderLogin)
.post(passport.authenticate(
    'local',  
    { 
        failureFlash: true, 
        failureRedirect: '/login' 
    }), 
    users.login
);

router.get('/logout', users.renderLogout);


module.exports = router; 
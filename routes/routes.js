var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');

//Schemas
var Article = require('../models/article.js');
var User = require('../models/user.js');
var Comment = require('../models/comment.js');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/',function(req,res){
	res.render('index',{
		user:req.user
	});
});

router.get('/home', isAuthenticated, function(req, res){
  res.render('home', { user: req.user });
});
 

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', passport.authenticate('signup',{
	successRedirect: '/',
	failureRedirect: '/login'
}));


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
 
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
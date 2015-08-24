var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');

//Schemas
var Article = require('../models/article.js');
var User = require('../models/user.js');
var Comment = require('../models/comment.js');

//function to check if user is logged in.
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

//Route to home page aka Latest News
router.get('/',function(req,res){
	res.render('index',{
		user:req.user
	});
});

//Route to get top stories
router.get('/top',function(req,res){
  res.render('top');
});

//Route to register the user
router.get('/register', function(req, res) {
    if(req.user){
      //redirect if user is logged in
      res.redirect('/');
    }
    res.render('register', { });
});

//Handle post request to register the user
router.post('/register', passport.authenticate('signup',{
	successRedirect: '/',
	failureRedirect: '/login'
}));

//Route to login page
router.get('/login', function(req, res) {
    if(req.user){
      res.redirect('/');
    }
    res.render('login', { user : req.user });
});

//Route to authenticate the user
router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
 
//Route to log the user out and end the session
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//Route to get an individual article
router.get('/article/:id',function(req,res){
  res.render('article.jade', {
    article:Article.findOne({_id:req.params.id})
});
});


//REST API for the app

//Request to get the articles in groups of 10 starting from the latest determined by the page variable (0 for the first batch)
router.get('/api/articles/:page',function(req,res){
  var x = {};
  Article.find({})
         .limit(10)
         .skip(req.params.page*10)
         .sort({timestamp:-1})
         .exec(function(err,arts){
            res.json(arts);
         });
});

//Request to get an article JSON by its ID
router.get('/api/article/:id',function(req,res){
  Article.findOne({_id:req.params.id})
  .exec(function(err,art){
    res.json(art);
  });
});
module.exports = router;
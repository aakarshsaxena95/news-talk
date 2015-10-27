/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />

var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');
var q = require('q');
var ObjectID = require('mongoose').Schema.ObjectId;

/*
*     Schemas
*/
var Article = require('../models/article.js');
var User = require('../models/user.js');
var Comment = require('../models/comment.js');

//function to check if user is logged in.
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/*
*       LATEST NEWS FETCH   (10 PER PAGE)
*       Request to get the articles in groups of 10 starting from the latest determined by 
*       the page variable (0 for the first batch)
*/
router.get('/api/articles/:page',function(req,res){
  var articleObj = {};
  Article.find({})
         .limit(10)
         .skip(req.params.page*10)
         .sort({timestamp:-1})
         .exec(function(err,arts){
          articleObj.articles = arts;
            if (arts.length<10){
              articleObj.reachedEnd = true;
            }
            res.json(articleObj);
         });
});

//Request to get an article JSON by its ID
router.get('/api/article/:id',function(req,res){
  Article.findOne({_id:req.params.id})
  .exec(function(err,art){
    res.json(art);
  });
});

/*
*    ARTICLE VOTING
*/


/*
*     Upvote
*/
router.post('/api/article/up/:id',function(req,res){
  Article.findByIdAndUpdate(req.params.id, {$pull:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Article.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});

/*
*     Downvote
*/
router.post('/api/article/down/:id',function(req,res){
  Article.findByIdAndUpdate(req.params.id, {$pull:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Article.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});


module.exports = router;
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
  POST ROUTES
  Redirects
*/

//Handle post request to register the user
router.post('/register', passport.authenticate('signup',{
	successRedirect: '/',
	failureRedirect: '/login'
}));

//Route to authenticate the user
router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
 

/*
*     Fetch data for reading list
*/
router.get('/api/readinglist/:page',function(req,res){
  var articleArr = {articles:[]};
  req.user.readingList.forEach(function(articleID){
    Article.findOne({_id:articleID})
    .exec(function(err,art){
      articleArr.articles.push(art);
      if(articleArr.articles.length===req.user.readingList.length){
        res.json(articleArr);   
      }
   });
  });
});

/*
 *    Fetch titles and links of reading list 
 */
router.get('/api/readinglistlinks',function(req,res){
  var articleArr = {articles:[]};
  if(req.user){
      req.user.readingList.forEach(function(articleID){
        Article.findOne({_id:articleID})
        .exec(function(err,art){
          if(art){
            articleArr.articles.push({url: art.url, title: art.title});
            if(articleArr.articles.length===req.user.readingList.length){
              res.json(articleArr);
            }   
          }
         });
      });
  }
  else res.send("User not logged in");
});

router.get('/api/commentsforprofile',function(req,res){
  var finalObj = [];
  q.fcall(function(){
  if(req.user){
    req.user.comments.forEach(function(comment){
      Comment.findOne({_id:comment}).exec(function(err,comm){
        console.log(comm);
        Article.findOne({_id:comm.article}).exec(function(err,art){
          finalObj.push({
            artTitle: art.title,
            url: '/article/'+art._id.toString(),
            contents: comm.content,
            timestamp: comm.timestamp
          });    
        if(finalObj.length === req.user.comments.length){
          res.json(finalObj);
        }
        });
      });
    });
  }
  });
});

//Addition to reading List
router.post('/api/user/add/:uid',function(req,res){
  console.log(req.body);
  User.update({
    _id:req.body.user
  },
  {$addToSet:{readingList:req.body.id}},null,function(err,numAffected){
    console.log(numAffected);
  });
});

//Removal from reading list
router.post('/api/user/rem/:uid',function(req,res){
  console.log(req.body.id);
  User.update({
    _id:req.user._id
  },
  {$pull:{readingList:req.body.id}},null,function(err,numAffected){
    console.log(numAffected);
  });
});


module.exports = router;
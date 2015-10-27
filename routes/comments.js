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

//Request to get a comments on an article JSON by its ID
router.get('/api/article/comments/:id',function(req,res){
  var commentsArr = {comments : []};
  Article.findOne({_id:req.params.id})
  .exec(function(err,art){
    art.comments.forEach(function(commentID){
      Comment.findOne({_id:commentID})
        .exec(function(err,comm){
          commentsArr.comments.push(comm);
          if(commentsArr.comments.length === art.comments.length){
            commentsArr.comments.sort(function(a,b) {
              return(a.timestamp - b.timestamp);
            });
            res.json(commentsArr);
          }
      });
    });
  });
});

//Request to get a comments on an comment JSON by its ID
router.get('/api/comments/:id',function(req,res){
  var commentsArr = {comments : []};
  Comment.findOne({_id:req.params.id})
  .exec(function(err,art){
    art.comments.forEach(function(commentID){
      Comment.findOne({_id:commentID})
        .exec(function(err,comm){
          commentsArr.comments.push(comm);
          if(commentsArr.comments.length === art.comments.length){
            commentsArr.comments.sort(function(a,b) {
              return(a.timestamp - b.timestamp);
            });
            res.json(commentsArr);
          }
      });
    });
  });
});


//Comment Addition
router.post('/api/article/:id',function(req,res){
  var newComment = new Comment();
  newComment.content = req.body.content;
  newComment.user.id = req.body.id;
  newComment.user.name = req.body.name;
  newComment.votes.up = [];
  newComment.votes.down = [];
  newComment.comments = [];
  newComment.timestamp = Date.now();
  Article.findByIdAndUpdate(req.params.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  User.findByIdAndUpdate(req.body.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  newComment.article=req.params.id;
  newComment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      console.log(newComment);
      res.send(newComment);
    }
  });
});

//comment deletion
router.delete('/api/delete/comment/:id',function(req,res){
  if(req.user)
  Comment.findByIdAndRemove(req.params.id, function(err,offer){
    if(err) console.log(err);
    else console.log(offer);
  });
  User.findByIdAndUpdate(req.body.id,{$pull:{comments:ObjectID(req.params.id)}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  Article.findByIdAndUpdate(req.body.id,{$pull:{comments:ObjectID(req.params.id)}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  console.log('removed',req.params.id);
});

//Comment on comment
router.post('/api/article/:id',function(req,res){
  var newComment = new Comment();
  newComment.content = req.body.content;
  newComment.user.id = req.body.id;
  newComment.user.name = req.body.name;
  newComment.votes.up = [];
  newComment.votes.down = [];
  newComment.comments = [];
  newComment.timestamp = Date.now();
  Comment.findByIdAndUpdate(req.params.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  User.findByIdAndUpdate(req.body.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  newComment.article=req.params.id;
  newComment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      console.log(newComment);
      res.send(newComment);
    }
  });
});


module.exports = router;
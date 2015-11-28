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

//Function to check if user is logged in.
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
               var i = commentsArr.comments.length;
               while( i-- ) if(commentsArr.comments[i] === null ) commentsArr.comments.splice(i,1);
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
  Article.findByIdAndUpdate(req.params.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){});
  User.findByIdAndUpdate(req.body.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){});
  newComment.article=req.params.id;
  newComment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      res.send(newComment);
    }
  });
});

//comment deletion
router.delete('/api/delete/comment/:commentId/:articleId',function(req,res){
  console.log(req.user.id);
  if(req.user)
  console.log("In comment delete");
  Comment.findByIdAndRemove(req.params.commentId, function(err,comment){
    if(err) console.log(err);
    else console.log(comment);
  });
  User.findById(req.user.id,function(err,numAffected){
    console.log(err,numAffected);
  });
  Article.findById(req.params.articleId,function(err,numAffected){
    console.log(err,numAffected);
  });
  console.log('removed',req.params.commentsId);
});

//Comment upvote
router.post('/api/comment/up/:id',function(req,res){
  Comment.findByIdAndUpdate(req.params.id, {$pull:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Comment.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$pull:{"votes.down":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$addToSet:{"votes.up":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});


//Comment downvote
router.post('/api/comment/down/:id',function(req,res){
  Comment.findByIdAndUpdate(req.params.id, {$pull:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Comment.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$pull:{"votes.up":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$addToSet:{"votes.down":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});

//Add comment on comment
router.post('/api/comment/add/:commentId',function(req,res){
  if(req.user){
    Comment.findByIdAndUpdate(req.params.commentId,{$addToSet:{comments:req.body.comment}},function(err,affected){
      console.log(affected);
    });
  }
  else res.send(403,{"Status":"403"});
});

module.exports = router;
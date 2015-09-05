var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');
var q = require('q');
var ObjectID = require('mongoose').Schema.ObjectId;

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


/*
  GET ROUTES
*/

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

//Route to get reading list
router.get('/readinglist/',function(req,res){
  if(!req.user){
   res.redirect('/login'); 
  }
  res.render('readinglist',{
    user:req.user
  });
});

//Route to register the user
router.get('/register', function(req, res) {
    if(req.user){
      //redirect if user is logged in
      res.redirect('/');
    }
    res.render('register', { });
});

//Route to login page
router.get('/login', function(req, res) {
    if(req.user){
      res.redirect('/');
    }
    res.render('login', { user : req.user });
});

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

/*
  POST ROUTES
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
 
//REST API for the app

//Request to get the articles in groups of 10 starting from the latest determined by the page variable (0 for the first batch)
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

//Fetch data for reading list
router.get('/api/readinglist/:page',function(req,res){
  articleArr ={articles:[]};
  console.log("recieved"+req.user.readingList);
  req.user.readingList.forEach(function(articleID){
    Article.findOne({_id:articleID})
    .exec(function(err,art){
      articleArr.articles.push(art);
      if(articleArr.articles.length===req.user.readingList.length){
        
    console.log(articleArr);
    res.json(articleArr);   
      }
   });
  });
});

//Request to get an article JSON by its ID
router.get('/api/article/:id',function(req,res){
  Article.findOne({_id:req.params.id})
  .exec(function(err,art){
    res.json(art);
  });
});

//Request to get an comments on an article JSON by its ID
router.get('/api/article/comments/:id',function(req,res){
  commentsArr = {comments:[]};
  Article.findOne({_id:req.params.id})
  .exec(function(err,art){
    console.log(art);
    art.comments.forEach(function(commentID){
      Comment.findOne({_id:commentID})
        .exec(function(err,comm){
          console.log(comm);
          commentsArr.comments.push(comm);
          if(commentsArr.comments.length === art.comments.length){
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
  console.log(newComment);
  Article.findByIdAndUpdate(req.params.id,{$addToSet:{comments:newComment._id}},null,function(err,numAffected){
    console.log(err,numAffected);
  });
  newComment.article=req.params.id;
  console.log(req.params.id);
  newComment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      console.log("Yay");
      res.send();
    }
  });
});

//Addition to reading List
router.post('/api/user/:uid',function(req,res){
  console.log(req.body);
  User.update({
    _id:req.body.user
  },
  {$addToSet:{readingList:req.body.id}},null,function(err,numAffected){
    console.log(numAffected);
  });
});



//VOTING
//Upvotes
router.post('/api/article/up/:id',function(req,res){
  console.log(mongoose.Schema.ObjectId(req.user.id));
  Article.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});

module.exports = router;
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

//Request for Top articles for the week.
router.get('/api/top/week/:page',function(req,res){
   Article.aggregate(
    [{
        "$match": {
              "timestamp": {
                  "$lte": new Date(),
                  "$gte": new Date((new Date()) - 7 * 1000 * 86400)
              }
          }
      },
      { "$project": {
            "timestamp": 1,
            "url": 1,
            "abstract": 1,
            "title": 1,
            "section": 1,
            "comments": 1,
            "votes": 1,
            "image": 1,
            "voteCount": { 
                "$subtract": [
                    { "$size": "$votes.up" },
                    { "$size": "$votes.down" }
                ]
            }
        }},
        { "$sort": { "voteCount": -1 } },
        { "$skip": req.params.page*10 },
        { "$limit": 10 },
    ],
    function(err,results) {
        if(results.length < 10){
          results.reachedEnd = true;
        }
        res.json(results);
    }
);
});

//Request for Top articles for the day
router.get('/api/top/day/:page',function(req,res){
   Article.aggregate(
    [{
        "$match": {
              "timestamp": {
                  "$lte": new Date(),
                  "$gte": new Date((new Date()) - 1000 * 86400)
              }
          }
      },
      { "$project": {
            "timestamp": 1,
            "url": 1,
            "abstract": 1,
            "title": 1,
            "section": 1,
            "comments": 1,
            "votes": 1,
            "image": 1,
            "voteCount": { 
                "$subtract": [
                    { "$size": "$votes.up" },
                    { "$size": "$votes.down" }
                ]
            }
        }},
        { "$sort": { "voteCount": -1 } },
        { "$skip": req.params.page*10 },
        { "$limit": 10 },
    ],
    function(err,results) {
        if(results.length < 10){
          results.reachedEnd = true;
        }
        res.json(results);
    }
);
});

//Request for top articles for the month
router.get('/api/top/month/:page',function(req,res){
   Article.aggregate(
    [{
        "$match": {
              "timestamp": {
                  "$lte": new Date(),
                  "$gte": new Date((new Date()) - 30 * 1000 * 86400)
              }
          }
      },
      { "$project": {
            "timestamp": 1,
            "url": 1,
            "abstract": 1,
            "title": 1,
            "section": 1,
            "comments": 1,
            "votes": 1,
            "image": 1,
            "voteCount": { 
                "$subtract": [
                    { "$size": "$votes.up" },
                    { "$size": "$votes.down" }
                ]
            }
        }},
        { "$sort": { "voteCount": -1 } },
        { "$skip": req.params.page*10 },
        { "$limit": 10 },
    ],
    function(err,results) {
        if(results.length < 10){
          results.reachedEnd = true;
        }
        res.json(results);
    }
);
});
//Request for All time top articles 
router.get('/api/top/all/:page',function(req,res){
   Article.aggregate(
    [{ "$project": {
            "timestamp": 1,
            "url": 1,
            "abstract": 1,
            "title": 1,
            "section": 1,
            "comments": 1,
            "votes": 1,
            "image": 1,
            "voteCount": { 
                "$subtract": [
                    { "$size": "$votes.up" },
                    { "$size": "$votes.down" }
                ]
            }
        }},
        { "$sort": { "voteCount": -1 } },
        { "$skip": req.params.page*10 },
        { "$limit": 10 },
    ],
    function(err,results) {
        if(results.length < 10){
          results.reachedEnd = true;
        }
        res.json(results);
    }
);
});


/*
*   ARTICLES BY TAGS.
*/
//Tag list for visualization
router.get('/api/tags/list',function(req,res){
  Article.aggregate({$group:{_id:"$section",count: { $sum: 1 }}},function(err,results){
    res.json(results);
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
  User.findByIdAndUpdate(req.user.id, {$pull:{"votes.down":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$addToSet:{"votes.up":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});

/*
*     Downvote
*/
router.post('/api/article/down/:id',function(req,res){
  Article.findByIdAndUpdate(req.params.id, {$pull:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Article.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$pull:{"votes.up":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  User.findByIdAndUpdate(req.user.id, {$addToSet:{"votes.down":(req.params.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});


module.exports = router;
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
*      GET ROUTES
       Routes for rendering pages.
       Following routes and corresponding page:
  
  Already Implemented

       ROUTE              PAGE                FILE                AUTHENTICATION REQUIRED
-------------------------------------------------------------------------------------------
  1.   /                  LATEST NEWS         index.jade          No
  2.   /top               TOP STORIES         top.jade            No
  3.   /readinglist       READING LIST        readinglist.jade    Yes
  4.   /register          REGISTERATION       register.jade       Must be logged out
  5.   /login             LOGIN               login.jade          Must be logged out
  6.   /article/:id       UNIQUE ARTICLE      article.jade        No
  7.   /logout            LOGOUT              -----N/A-------     Yes
  8.   /myprofile         USER PROFILE AND OPTIONS                Passowrd change
  9.   /user/:userid      USER RPOFILE OF OTHER USERS             Display comments
                                                                  Display upvotes
                                                                  Reading List
-------------------------------------------------------------------------------------------

  To be implemented
       ROUTE              MAIN USE                      FEATURES
  
  3.   /about             ABOUT PAGE OF THE APP

  4.   /tags              LIST ALL TAGS WITH LINKS      Make a graph with size depending on
                                                        amount of posts on a certain tag
                                                        List all tags seperately.
  
  5.   /tag/:tagname      POSTS UNDER THIS TAG          List articles by tagname. 
                                                        Allow sorting by latest and top.

  6.   /contact           CONTACT PAGE  

---------------------------------------------------------------------------------------------------

COMMON PAGES    
    2. Comment edit and delete
    3. Comment:-  vote & reply (ng-show Show Comments only if comments are actually there)
*/

/*
*     Route to home page aka LATEST NEWS
*/
router.get('/',function(req,res){
	res.render('index',{
		user:req.user
	});
});


/*
*     Route to get TOP STORIES
*/
router.get('/top',function(req,res){
  res.render('top',{
		user:req.user
	});
});

/*
 *      Route to get tags page.
 */
router.get('/tags',function(req,res){
  res.render('tags',{
		user:req.user
	});
});

/*
*     Route to get READING LIST
*/
router.get('/readinglist/',function(req,res){
  if(!req.user){
   res.redirect('/login'); 
  }
  res.render('readinglist',{
    user:req.user
  });
});

/*
*     Route to REGISTRATION
*/
router.get('/register', function(req, res) {
    if(req.user){
      //redirect if user is logged in
      res.redirect('/');
    }
    res.render('register', { });
});

/*
*     Route to login page
*/
router.get('/login', function(req, res) {
    if(req.user){
      res.redirect('/');
    }
    res.render('login', { user : req.user });
});

/*
*     Route to log the user out and end the session
*/
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*
*     Route to get an individual article
*/
router.get('/article/:id',function(req,res){
  res.render('article.jade', {
    article:Article.findOne({_id:req.params.id})
  });
});

/*
*     Route to my profile page
*/
router.get('/myprofile',function(req,res){
  if(!req.user){
   res.redirect('/login'); 
  }
  res.render('user',{
    user:req.user
  });
});

router.get('/user/:userid',function(req,res){
  if(req.user){
    if(req.user._id == req.params.userid){
      res.redirect('/myprofile');
    }
    else{
      res.render('user',{user:req.user});
    }
  }
});



/*
* REST API for the app
----------------------------------------------------------------------------------------------------
  ALREADY IMPLEMENTED

           ROUTE                            DATA                          AUTH   NOTES
    -------------------------------------------------------------------------------------------
      a) ARTICLES (All routes are GET)
          1.   /api/articles/:page          10 ARTICLES PER PAGE          No
          2.   /api/readinglist/:page       10 ARTICLES PER PAGE          Yes
          3.   /api/article/:id             1 ARTICLE SENT                No     Send comments as well
          4.   /api/top/
              * Day
              * Month
              * Year
              * All time
           
      b) COMMENTS
          GET
           1.   /api/article/comments/:id    COMMENTS ON THE ARTICLE       No
          POST
           1.   /api/article/:id             ADD COMMENTS ON ARTICLES      Yes
          PUT 
          DELETE

      c) USERS
  
  TO BE IMPLEMENTED
      ARTICLES
          Get articles by tags
      COMMENTS
          GET, POST, DELETE and EDIT  comments on comments
      USERS
          GET other users info w/o passwords
*/
          
module.exports = router;
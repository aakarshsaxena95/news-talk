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
-------------------------------------------------------------------------------------------

  To be implemented
       ROUTE              MAIN USE                      FEATURES
  1.   /myprofile         USER PROFILE AND OPTIONS      Passowrd change
                                                        Display comments
                                                        Display upvotes
                                                        Reading List
  
  2.   /user/:userid      USER RPOFILE OF OTHER USERS   Display comments
                                                        Display upvotes
                                                        Reading List
  
  3.   /about             ABOUT PAGE OF THE APP

  4.   /tags              LIST ALL TAGS WITH LINKS      Make a graph with size depending on
                                                        amount of posts on a certain tag
                                                        List all tags seperately.
  
  5.   /tag/:tagname      POSTS UNDER THIS TAG          List articles by tagname. 
                                                        Allow sorting by latest and top.

  6.   /contact           CONTACT PAGE  

---------------------------------------------------------------------------------------------------

COMMON PAGES
    
    1. Upvotes and downvotes(When doing either, check if user already up or downed it. if yes proceed accordingly)
    2. Comment edit and delete
    3. Comment:-  vote & reply (ng-show Show Comments only if comments are actually there)
    4. 



  Others
  TWITTER FEED -------------------------------------------------------------------------------
  FACEBOOK GRAPH API--------------------------------------------------------------------------
  SENTIMENT ANALYSIS--------------------------------------------------------------------------
  RECOMMENDATION SYSTEM FOR USERS-------------------------------------------------------------
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
  res.render('top');
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
})

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
* REST API for the app
----------------------------------------------------------------------------------------------------
  ALREADY IMPLEMENTED

           ROUTE                            DATA                          AUTH   NOTES
    -------------------------------------------------------------------------------------------
      a) ARTICLES (All routes are GET)
          1.   /api/articles/:page          10 ARTICLES PER PAGE          No
          2.   /api/readinglist/:page       10 ARTICLES PER PAGE          Yes
          3.   /api/article/:id             1 ARTICLE SENT                No     Send comments as well
           
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
          Get articles by top
              * Day
              * Month
              * Year
              * All time
          Search and return best matched articles

      COMMENTS
          GET, POST, DELETE and EDIT  comments on comments
      

      USERS
          GET other users info w/o passwords
*/
          

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
})
/*
*     TOP ARTICLES
*     By Day, month and week
*     
*     //TODO: insert code to modify the dates
*
*/

// //DAY
// router.get('/api/top/day/:page',function(req,res){
//       Article.find({})
//          .limit(10)
//          .skip(req.params.page*10)
//          .sort({votes.up:-1})
//          .exec(function(err,arts){
//           articleObj.articles = arts;
//             if (arts.length<10){
//               articleObj.reachedEnd = true;
//             }
//             res.json(articleObj);
//          });
// });

//WEEK
router.get('/api/top/week/:page',function(req,res){
//      var articleObj = {};
//      Article.find({})
//         .limit(10)
//         .skip(req.params.page*10)
//         
//         .sort({votecount:-1})
//         .exec(function(err,arts){
//          articleObj.articles = arts;
//            if (arts.length<10){
//              articleObj.reachedEnd = true;
//            }
//            res.json(articleObj);
//         });
         
         Article.aggregate(
    [
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

// //MONTH
// router.get('/api/top/month/:page',function(req,res){
//         Article.find({})
//          .limit(10)
//          .skip(req.params.page*10)
//          .sort({votes.up:-1})
//          .exec(function(err,arts){
//           articleObj.articles = arts;
//             if (arts.length<10){
//               articleObj.reachedEnd = true;
//             }
//             res.json(articleObj);
//          });
// });

//ALL-TIME
// router.get('/api/top/:page',function(req,res){
//         Article.find({})
//          .limit(10)
//          .skip(req.params.page*10)
//          .sort({votes.up:-1})
//          .exec(function(err,arts){
//           articleObj.articles = arts;
//             if (arts.length<10){
//               articleObj.reachedEnd = true;
//             }
//             res.json(articleObj);
//          });
// });


// //Fetch articles by tags
// router.get('/api/articles/:page',function(req,res){
//   var articleObj = {};
//   Article.find({})
//          .limit(10)
//          .skip(req.params.page*10)
//          .sort({timestamp:-1})
//          .exec(function(err,arts){
//           articleObj.articles = arts;
//             if (arts.length<10){
//               articleObj.reachedEnd = true;
//             }
//             res.json(articleObj);
//          });
// });

//Request to get an article JSON by its ID
router.get('/api/article/:id',function(req,res){
  Article.findOne({_id:req.params.id})
  .exec(function(err,art){
    res.json(art);
  });
});

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
  newComment.article=req.params.id;
  newComment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      console.log("Yay");
      res.send(newComment);
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


/*
*     VOTING
*/


/*
*     Upvote
*/
router.post('/api/article/up/:id',function(req,res){
  console.log(mongoose.Schema.ObjectId(req.user.id));
  Article.findByIdAndUpdate(req.params.id, {$pull:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Article.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});

/*
*     Downvote
*/
router.post('/api/article/down/:id',function(req,res){
  console.log(mongoose.Schema.ObjectId(req.user.id));
  Article.findByIdAndUpdate(req.params.id, {$pull:{"votes.up":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  Article.findByIdAndUpdate(req.params.id, {$addToSet:{"votes.down":(req.user.id)}}, null,function(asdf){console.log(asdf);});
  res.send('Updated');  
});


module.exports = router;
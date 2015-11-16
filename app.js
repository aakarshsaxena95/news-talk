/// <reference path="./typings/express/express.d.ts" />
/// <reference path="./typings/node/node.d.ts" />

//Main dependencies
var request = require('request');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var expressSession = require('express-session');

//Other middleware for express
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var toastr = require('express-toastr');

//Passport requires
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./config/passport')(passport);

//Schemas
var Article = require('./models/article.js');
var User = require('./models/user.js');
var Comment = require('./models/comment.js');

//Database connection
var m = mongoose.connect('mongodb://localhost/news-talk');
mongoose.connection.on('open',function(){
	mongoose.connection.db.listCollections(function (err, names) {
        console.log(names);
        module.exports.Collection = names;
 });
});

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(multer()); 
app.set('view engine','jade');
app.set('views',__dirname+'/views');

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
})); 

//Initialize login and signup system
app.use(passport.initialize());
app.use(passport.session());

//Declare the folder that'll be available through the website statically
app.use(express.static(path.join(__dirname, 'public')));
app.use(toastr());

  var url = 'http://api.nytimes.com/svc/topstories/v1/home.jsonp?api-key=c6d1eca37b6784fb7388b1095098fdd9:1:72686982';
   
  var getJsonFromJsonP = function (url, callback) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonpData = body;
        var json;
        try{
           json = JSON.parse(jsonpData);
        }
        catch(e){
            var startPos = jsonpData.indexOf('({');
            var endPos = jsonpData.indexOf('})');
            var jsonString = jsonpData.substring(startPos+1, endPos+1);
            json = JSON.parse(jsonString);
        }
        callback(null, json);
      }
      else{
        callback(error);
      }
    });
    //Calls the function every 60 seconds.
    setTimeout(function(){
     getJsonFromJsonP(url,saveArticleCallback); 
    },60000);
  };
  
  //Helper callback that saves new articles(if any).
  var saveArticleCallback =  function (err, data) {
  	if(data){
	    data.results.forEach(function(article){
	      Article.findOne({title:article.title},function(err,found){
	        if (err){
	          console.log('Error in finding article: '+err);
	          return done(err);
	        }
	        if (!found) {
            //Construct and add article if not found.
		          var newArticle = new Article();
		          newArticle.section = article.section;
		          newArticle.title = article.title;
		          newArticle.abstract = article.abstract;
		          newArticle.url = article.url.replace('\\','');
		          newArticle.images = [];
		          if(article.multimedia){
		          	var image = article.multimedia[article.multimedia.length-1]
		            newArticle.image.url = image.url;
		            newArticle.image.caption = image.caption;
		      	  }
		          newArticle.votes = {up:[],down:[]};
		          newArticle.comments = [];
		          newArticle.timestamp = new Date(article.created_date.substring(0,19)+'Z');
              console.log(article.created_date.substring(0,19)+'.000Z');
		          newArticle.save(function(err) {
		            if (err){
		              console.log('Error in Saving article: '+err);  
		              throw err;  
		            }
	          	  });
	        }
	    });
		});
	}
};

//One time function call. Then it is called every 60 seconds from within it. Not a recursive call though, so that stack is never overflowed.
getJsonFromJsonP(url,saveArticleCallback);


//Routes importing
var routes = require('./routes/routes.js');
var users = require('./routes/users.js');
var comments = require('./routes/comments.js');
var articles = require('./routes/articles.js')
app.use('/',routes);
app.use('/',articles);
app.use('/',comments);
app.use('/',users);

app.listen(8000,function(){
	console.log("Running the server on port "+3000);
});
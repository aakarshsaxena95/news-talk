var request = require('request');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var expressSession = require('express-session');

//Others
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); 

//Passport requires
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./config/passport')(passport);

//Schemas
var Article = require('./models/article.js');
var User = require('./models/user.js');
var Comment = require('./models/comment.js');

//Mongoose connect
var m = mongoose.connect('mongodb://localhost/news-talk');
mongoose.connection.on('open',function(){
	mongoose.connection.db.listCollections(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//Routes
var routes = require('./routes/routes.js');
var users = require('./routes/users');
app.use('/',routes);

app.listen(3000,function(){
	console.log("Running the server on port "+3000);
});
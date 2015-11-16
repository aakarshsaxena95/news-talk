/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt   = require('bcrypt-nodejs');
var fs = require('fs');

var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Login Strategy declaration
    passport.use('login', new LocalStrategy({passReqToCallback : true},function(req, username, password, done) { 
        // check in mongo if a user with username exists or not
        console.log(username,password);
        User.findOne({ 'email' :  req.body.username }, 
          function(err, user) {
            // In case of any error, return using the done method
            if (err)
              return done(err);
            // Username does not exist, log error & redirect back
            if (!user){
              console.log('User Not Found with username '+username);
              return done(null, false, 
                    req.flash("not found"));
            }
            // User exists but wrong password, log the error 
            if (req.body.password!=user.password){
              console.log('Invalid Password');
              return done(null, false, 
                  console.log("nope"));
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            return done(null, user);
          }
        );
    }));
    

    passport.use('signup', new LocalStrategy({passReqToCallback : true},function(req, name, password, done) {
        var findOrCreateUser = function(){
          // find a user in Mongo with provided email
          User.findOne({'email':req.body.email},function(err, user) {
            if (err){
              console.log('Error in SignUp: '+err);
              return done(err);
            }
            // User Exists
            if (user) {
              console.log('User already exists');
              return done(null, false, 
                console.log("User already exists"));
            } 
            else {
            // create the user
              var newUser = new User();
              
              //Save profile picture.
              fs.readFile(req.files.profilePicture.path, function (err, data) {
                console.log(req.files.profilePicture);
                var newPath = "/home/ayushgp/learning/webdev/news-talk/public/img/profilePicture/"+newUser._id+".jpg";
                var relPath = "img/profilePicture/"+newUser._id+".jpg";
                fs.writeFile(newPath, data, function (err) {
                newUser.profilePicture = relPath;      
                console.log(newUser,"YOYLO");
                newUser.name = name;
              
              newUser.password = password;
              newUser.email = req.param('email');
              newUser.votes = {up:[],down:[]};
              newUser.comments = [];
              newUser.readingList = [];
              
              newUser.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);  
                  throw err;  
                }    
                return done(null, newUser);
              });
                });
              });
              
            }
          });
        };
        findOrCreateUser();
      }));
};
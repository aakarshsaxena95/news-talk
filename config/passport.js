var LocalStrategy   = require('passport-local').Strategy;
var bCrypt   = require('bcrypt-nodejs');

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

    var isValidPassword = function(user, password){
        console.log(password,user,user.password);
  return bCrypt.compareSync(password, user.password);
}

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
        findOrCreateUser = function(){
          // find a user in Mongo with provided email
          

          User.findOne({'email':req.body.email},function(err, user) {
            // In case of any error return
            if (err){
              console.log('Error in SignUp: '+err);
              return done(err);
            }
            // already exists
            if (user) {
              console.log('User already exists');
              return done(null, false, 
                console.log("User already exists"));
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();
              // set the user's local credentials
              newUser.name = name;
              newUser.password = password;
              newUser.email = req.param('email');
              newUser.profilePicture = "";
              newUser.readingList = [];
              // save the user
              newUser.save(function(err) {
                console.log("in save");
                if (err){
                  console.log('Error in Saving user: '+err);  
                  throw err;  
                }
                console.log("Created new user "+newUser);    
                return done(null, newUser);
              });
            }
          });
        };
        findOrCreateUser();
      }));
};
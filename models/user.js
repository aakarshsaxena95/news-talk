var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local');

var ObjectID = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	profilePicture: String,
	password: String,
	readingList: [ObjectID],
	comments: [ObjectID],
	votes:{
		up:[ObjectID],
		down:[ObjectID]
	}
},{ strict: false });


var User = mongoose.model('User',UserSchema,'users');

module.exports = User;
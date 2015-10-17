var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ObjectID = require('mongoose').Schema.ObjectId;

var commentsSchema = new mongoose.Schema({
	content: String,
	user: {
		name:String,
		id:String,
	},
	article: String,
	votes:{
		up:[ObjectID],
		down:[ObjectID]
	},
	comments:[ObjectID],
	timestamp:Date
},{strict:false});

Comment = mongoose.model('Comment',commentsSchema);
module.exports = Comment;
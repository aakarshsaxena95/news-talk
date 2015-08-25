var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ObjectID = mongoose.Schema.Types.ObjectId;

var commentsSchema = new mongoose.Schema({
	content: String,
	user: String,
	votes:{
		up:[ObjectID],
		down:[ObjectID]
	},
	comments:[ObjectID],
	timestamp:Date
});

Comment = mongoose.model('Comment',commentsSchema);
module.exports = Comment;
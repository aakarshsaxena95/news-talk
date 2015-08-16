var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ObjectID = mongoose.Schema.Types.ObjectId;


var articleSchema = new mongoose.Schema({
	title: String,
	content: String,
	image: String,
	votes:{
		up: [ObjectID],
		down: [ObjectID]
	},
	comments:[ObjectID],
	timestamp: Date
});

Article = mongoose.model('Article',articleSchema);
module.exports = Article;
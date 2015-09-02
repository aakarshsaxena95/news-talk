var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ObjectID = require('mongoose').Schema.ObjectId;


var articleSchema = new mongoose.Schema({
	section: String,
	title: String,
	abstract: String,
	url: String,
	image: {
		url: String,
		caption: String
	},
	votes:{
		up: [ObjectID],
		down: [ObjectID]
	},
	comments:[ObjectID],
	timestamp: String
},{strict:false});

Article = mongoose.model('Article',articleSchema,'articles');
module.exports = Article;
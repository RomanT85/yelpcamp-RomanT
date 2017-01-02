//======================================
// DATABE SCHEMA SETUP
//======================================
var mongoose = require("mongoose"),
	Schema 	= mongoose.Schema;

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	location: [
	{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Location'
	}
	],
	created: {type: Date, default: Date.now},
	comments: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}
	],
	ratings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Rating"
		}
	],
	rating: {
		type: Number,
		default: 0
	}
});
campgroundSchema.index({location: 1});
campgroundSchema.index({name: 1});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
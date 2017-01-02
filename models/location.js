var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var locationSchema = new mongoose.Schema({
    location:{ 
        type: {type: String}, 
		coordinates: [Number]
    },
    author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
		username: String
	}
});
locationSchema.index({location: '2dsphere'});
locationSchema.index({author: 1});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;
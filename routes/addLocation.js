var express         = require('express'),
    async           = require('async'),
    nodeGeoCoder    = require('node-geocoder'),
    router          = express.Router();

//require Schemas and middleware
var Campground 		= require("../models/campground.js"),
	Comment 		= require("../models/comments.js"),
	User 			= require("../models/user.js"),
    Location        = require("../models/location.js"),
	middlewareObj 	= require("../middleware/index.js"),
	passportConf 	= require('../config/passport');

//Setup GeoCoder
var options	= {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: 'AIzaSyBJsl4969RF3tzhGSIg7h9wnaof2JvpZWA',
	formatter: null
};

var geoCoder = nodeGeoCoder(options);
var funcGeoCoder = {};
funcGeoCoder.addLoc = function(req, res, next) {
    geoCoder.geocode(req.body.location, function(err, resdata, cb) {
	    if(err){
		    console.error(err);
            return(err);
	    } else {
		    console.log(resdata);
            cb(resdata);
            next();
	    }
    });
};

//routes to Add Campgrounds location
router.get('/campgrounds/:id/location/add', middlewareObj.checkCampgroundOwnership, function(req, res, next) {
	Campground.findById(req.params.id, function(err, Campground) {
		if(err) {
			console.error(err);
			return next(err);
		} else {
			res.render('campgrounds/addLocation', {
				Campground: Campground,
				error: err
			});
		}
	});
});

router.post('/campgrounds/:id/location', middlewareObj.checkCampgroundOwnership, funcGeoCoder.addLoc, function(req, res, next) {
    async.waterfall([
        function(resdata, callback) {
            Campground.findById(req.params.id, function(err, foundCampground) {
		        if(err) {
			        console.error(err);
			        return next(err);
                } else {
                    callback(null, foundCampground, resdata);
                }
            });
        },
        function(foundCampground, resdata) {
            var coords = [];
            coords[0] = req.resdata.longitude;
            coords[1] = req.resdata.latitude;
            var location = new Location();
            location.type = 'Point';
            location.coordinates = coords;
            location.author = {
		        id: req.user._id,
		        username: req.user.username
	        };
            location.save();
            foundCampground.location.push(location);
            foundCampground.save(function(err) {
                if(err) { 
                    console.error(err);
                    return next(err);
                } else {
                    req.flash('success', req.user.username+', you have successfully added location to the ' +req.foundCampground.name+' campground.');
                    res.redirect('/campgrounds/'+foundCampground._id);
                }
            });
        }
    ]);
});

module.exports = router;
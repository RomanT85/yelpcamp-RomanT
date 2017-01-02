var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var multer 		= require('multer');
var upload 		= multer({ dest: './public/images/uploads' });
var User 		= require("../models/user.js");
var Campground 	= require('../models/campground');
var middlewareObj = require("../middleware/index.js");
var passportConf = require('../config/passport');

//===================================================
//ROOT ROUTE
//===================================================

function paginate(req, res, next) {
	var perPage = 4;
	var page = req.params.page || 1;
	var output = {
		data: null,
		pages: {
			current: page,
			prev: 0,
			hasPrev: false,
			next: 0,
			hasNext: false,
			total: 0
		},
		items: {
        	begin: ((page * perPage) - perPage) + 1,
        	end: page * perPage,
        	total: 0
      	}
	};
	Campground
	.find()
	.where('author.id').equals(req.user.id)
	.skip((page - 1) * perPage)
    .limit(perPage)
    .sort('desc')
    .populate('location')	
    .exec(function(err, foundCampgrounds) {
      	if(err) return next(err);

      	Campground.count().where('author.id').equals(req.user.id).exec(function(err, count) {
      		if(err) return next(err);
      		output.items.total = count;
      		output.data = foundCampgrounds;
        	output.pages.total = Math.ceil(output.items.total / perPage);
      		if(output.pages.current < output.pages.total) {
      			output.pages.next = Number(output.pages.current) + 1;
      		} else {
      			output.pages.next = 0;
      		}      
      		output.pages.hasNext = (output.pages.next !== 0);
      		output.pages.prev = output.pages.current - 1;
     	 	output.pages.hasPrev = (output.pages.prev !== 0);
      		if (output.items.end > output.items.total) {
        		output.items.end = output.items.total;
      		}
      		console.log(output);
      		res.render("profile/profilepage", {
    			campgrounds: foundCampgrounds,
    			output: output
    		});
      	});
    });
}	

router.get("/", function(req, res){
	res.render("landing");
});

router.get("/profile", passportConf.isAuthenticated, function(req, res, next){
	paginate(req, res, next);
});

router.get('/profile/page/:page', function(req, res, next){
	paginate(req, res, next);
});

// Edit Profile

router.get("/profile/:id/edit", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("/profile");
		} else {
			res.render("profile/edit", {"User": foundUser});
		}
	});
});

router.put("/profile/:id", function(req, res){

	User.findByIdAndUpdate(req.params.id, req.body.User, function(err, updatedUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "Dear user " + currentUser.username + "Your account has been updated!");
			res.redirect("/profile");
		}
	});
});

//Image upload
router.get('/profile/:id/upload', function(req, res) {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("/profile");
		} else {
			res.render("profile/upload", {"User": foundUser});
		}
	});
});

router.post('/profile/:id', upload.single('image'), function(req, res, next) {
	if(req.file) {
 		console.log('Uploading file...');
 		var image = req.file.filename;
 		console.log('Uploading compleate!');
 	} else {
 		console.log('No file upload...');
 		var image = 'noimage.jpg';
 	}
 	User.findById(req.params.id, function(err, foundUser) {
 		var user = foundUser;
 		user.image = image;
 		user.save();
 		req.flash("success", "Image has been added!");
 		res.redirect('/profile');
 	});
});

//DELETE ROUTE

router.delete("/profile/:id", function(req, res){
	User.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "You account has been removed!");
			res.redirect("/campgrounds");
		}
	});
});

//===================================================
//AUTHENTICATION ROUTES
//===================================================

//SIGN UP

router.get("/signin", function(req, res){
	res.render("register", {
    message: req.flash('errors'),
    loginMessage: req.flash('loginMessage')
  });
});

//LOG IN

router.get("/login", function(req, res){
	res.render("register", { message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Goodbye, Welcome back again!");
	res.redirect("/campgrounds");
});

//===================================================
//EXPORTS
//===================================================

module.exports = router;
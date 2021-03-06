//===================================================
//APPLICATION REQUIREMENTS SETUP
//===================================================

var express 			= require("express"),
	bodyParser 			= require("body-parser"),
	session         	= require('express-session'),
	cookieParser 		= require('cookie-parser'),
	morgan 				= require('morgan'),
	flash           	= require('express-flash'),
	methodOverride 		= require("method-override"),
	mongoose 			= require("mongoose"),
	passport 			= require('passport'),
	MongoStore      	= require('connect-mongo/es5')(session),
	secret				= require('./config/secret'),
	User 				= require("./models/user.js"),
	Comment 			= require("./models/comments.js"),
	location			= require("./models/location.js"),
	Campground 			= require("./models/campground.js");

var app 				= express();

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect(secret.database, function(req ,err) {
    if (err) {
    	req.flash('error', 'Could not establish connection to the database.');
      console.log(err.message);
    } else {
      console.log("Successfully connected to the database!");
    }
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//===================================================
//PASSPORT CONFIGURATION
//===================================================
app.use(cookieParser());
app.use(require("express-session")({
	secret: secret.secretKey,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ url: secret.database, autoReconnect: true})
}));

app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require("moment");
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/*", function(req, res, next) {
	if(typeof req.cookies['connect.cid'] !== 'undefined') {
		console.log(req.cookies['connect.cid']);
	}
	next();
});

var commnetRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	campgroundLocation 	= require("./routes/addLocation"),
	passwordrecovery 	= require('./routes/passwordrecovery'),
	ratingRoutes 		= require('./routes/ratings'),
	apiRoutes 			= require('./api/index'),
	indexRoutes			= require("./routes/index");

app.use("/", indexRoutes);
app.use("/", passwordrecovery);
app.use(campgroundLocation);
app.use(apiRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/ratings", ratingRoutes);
app.use("/campgrounds/:id/comments", commnetRoutes);

//===================================================
//SERVER
//===================================================

app.listen(process.env.PORT || secret.portNumber, function(err){
	if(err) {
		console.error(err);
	} else {
		console.log("YelpCamp project has started, on port " + secret.portNumber + "!");
	}
});

//app.listen(process.env.PORT, process.env.IP, function(){
//console.log("The YelpCamp Server has started!");
//});
var express = require('express'),
	app 	= express(),
	User 	= require("../models/user.js");


app.post("/compareuname", function(req, res, next) {
	User.find(req.body.username, function(err, existingUser) {
		if(err) res.send(err.message);
    	if(existingUser) {
      		res.send('taken');
      	}
      	else {
      		res.send("success");
      	}
    });
});

app.post('/register', function(req, res, next) {
	res.send("Hello world");
});

/*router.post("/register", function(req, res, next){

	var user = new User();
	user.email = req.body.email;
	user.name.firstname = req.body.firstname;
	user.name.lastname = req.body.lastname;
	user.username = req.body.username;
	user.password = req.body.password;
   
	user.save(function(err, user) {
        if (err) return next(err);
     	req.logIn(user, function(err) {
        	if (err) return next(err);
        	res.send('success', 'Dear ' + user.name.firstname + ' ' 
        	+ user.name.lastname + ', "YelpCamp" welcomes you!');
        	res.redirect('/profile');
        });
    });
});*/

module.exports = app;
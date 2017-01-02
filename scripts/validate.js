$(document).ready(function() {

	var username = "";
	var email = "";
	var password = "";
	var repassword = "";
	var firstname = "";
	var lastname = "";

	var submitBtn = $("#submit-btn");

	function checkForValues() {

		

	}

	$("#signUpForm").on('keyup', "#username", function() {

		var usernameVal = $("#username").val();

			
			var unameData = {username: usernameVal};
			
			$.ajax({

				url: "/compareuname",
				method: "POST",
				contentType: "application/json",
				data: unameData,
				success: function(response) {
					if(response == "success") {
						$("#usernameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
						username = usernameVal;
					}
					else {
						$("#usernameInfo").html("Username \""+usernameVal+"\" is already taken.").css("color", "#a10b0b");
						username = "";
					}
					console.log(response);
					//$("#usernameInfo").html(response).css("color", "#a10b0b");
				}
			});
	});


	/*$("#username").keyup(function() {

		var usernameVal = $("#username");

		if(usernameVal.val() == "") {
			$("#usernameInfo").html("Username field can't be left empty.").css("color", "#a10b0b");
			username = "";
		}
		else if(!/^[a-zA-Z0-9\-\_]+$/.test(usernameVal.val())) {
			$("#usernameInfo").html("Username can contain only letters from a-z, A-Z and numbers from 0 to 9.").css("color", "#a10b0b");
			username = "";
		}
		else {
			$.ajax({

				url: "http://localhost:4000/compareuname",
				method: "POST",
				contentType: "application/json",
				data: JSON.stringify({username: unameVal.val()}),
				success: function(response) {
					// if(response == success) {
					// 	$("#usernameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
					// 	username = usernameVal;
					// }
					// else {
					// 	$("#usernameInfo").html("Username \""+usernameVal+"\" is already taken.").css("color", "#a10b0b");
					// 	username = "";
					// }
					console.log(response);
				}
			});
		}

	});*/

	$("#email").keyup(function() {

		var emailVal = $("#email").val();

		if(emailVal == "") {
			$("#emailInfo").html("Please enter your email.").css("color", "#a10b0b");
			email = "";
		}
		else if(!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(emailVal)) {
			$("#emailInfo").html("\""+emailVal+"\", is not valid email address.").css("color", "#a10b0b");
			email = "";
		}
		else {
			$("#emailInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
			email = emailVal;
		}

	});

	$("#firstname").keyup(function() {

		var firstnameVal = $("#firstname").val();

		if(firstnameVal == "") {
			$("#firstnameInfo").html("Please fill in your firstname.").css("color", "#a10b0b");
			firstname = "";
		}
		else {
			$("#firstnameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
			firstname = firstnameVal;
		}
	});

	$("#lastname").keyup(function() {

		var lastnameVal = $("#lastname").val();

		if(lastnameVal == "") {
			$("#lastnameInfo").html("Please fill in your lastname.").css("color", "#a10b0b");
			lastname = "";
		}
		else {
			$("#lastnameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
			lastname = lastnameVal;
		}

	});

	$("#password").keyup(function() {

		var passwordVal = $("#password").val();

		if(passwordVal == "") {
			$("#passwordInfo").html("Type in your password.").css("color", "#a10b0b");
			password = "";
		}
		else if(!/^[a-zA-Z0-9\-\_]+$/.test(passwordVal)) {
			$("#passwordInfo").html("Password can contain letters from a-z, A-Z and numbers from 0 to 9.").css("color", "#a10b0b");
			password = "";
		}
		else if(passwordVal.length < 8) {
			$("#passwordInfo").html("Password must be at least 8 characters long.").css("color", "#a10b0b");
			password = "";
		}
		else {
			$("#passwordInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
			password = passwordVal;
		}

	});

	$("#confPassword").keyup(function() {

		var confPasswordVal = $("#confPassword").val();

		if(confPasswordVal == "") {
			$("#confPasswordInfo").html("Please confirm your password.").css("color", "#a10b0b");
			confPassword = "";
		}
		else if(confPasswordVal.length < 8) {
			$("#confPasswordInfo").html("Password is too short.").css("color", "#a10b0b");
			confPassword = "";
		}
		else if(password !== confPasswordVal) {
			$("#confPasswordInfo").html("Passwords don't match.").css("color", "#a10b0b");
			confPassword = "";
		}
		else {
			$("#confPasswordInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css({"color": "#25b70e", "font-size": "27px"});
			confPassword = confPasswordVal;
		}

	});

	$("#signUpForm").on("submit",function(event) {

		event.preventDefault();

		checkForValues();
		submitBtn.prop("disabled", true);

		if(email == "" || firstname == "" || lastname == "" || username == "" || password == "" || confPassword == "") {
			$("#submitInfo").html("Please check that all required fields are filled correctly.").css("color", "#a10b0b");
			submitBtn.prop("disabled", false);
		}
		else {
			
			var data = {};
			data.email = email;
			data.username = username;
			data.firstname = firstname;
			data.lastname = lastname;
			data.password = password; 

			$.ajax({

				url: "http://localhost:4000/register",
				method: 'POST',
				data: JSON.stringify(data),
				contentType: "application/json",
				success: function(response) {
					if(response == "success") {

					}
				}

			});
		}

	});

});
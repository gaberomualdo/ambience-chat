// Set all text inputs to have no spellcheck
(function(){
	// gets all elements with tag name of input and with type of text and sets spellcheck to false
	$("input[type='text']").attr("spellcheck","false");
})();

// if it is signup page - if it has the param signup in the ? stage of url
var currentPage = window.location.href.split("?")[1];

if(currentPage == "signup"){
	// change button text and other to match signup page rather than signin page.

	$("h2").html("Sign Up For <a href='index.html'>Ambience</a>");
	$("form input[type='button']").attr("value","Sign In");
	$("form input[type='button']").attr("onclick",'window.open("index.html","_self")');
	$("form input[type='password']")[0].outerHTML = ('<input type="password" placeholder="Password:"><input type="password" placeholder="Confirm Password:">');
	$("form input[type='submit']").attr("value","Sign Up");
}

// Sign in and sign up functionality

// Validate password function
function validatePassword(){
	// This function returns an array - array[0] is boolean for if is valid, array[1] is error message if password isn't valid

	// Check if connected to internet
	if(!navigator.onLine){
		return [false,"No Connection"];
	}

	// Check if firebase exists, if not server error
	if(typeof firebase == 'undefined'){
		return [false,"Server Error"];
	}

	// Check if email is an ASL email
	if($("form input[type='text']:eq(0)").val().endsWith("@asl.org") == false){
		return [false,"Email Must End With @asl.org"];
	}

	// if in Signup Page
	if(currentPage == "signup"){		
		// Check if both password fields' values match
		if($("form input[type='password']:eq(0)").val() != $("form input[type='password']:eq(1)").val()){
			return [false,"Passwords Do Not Match"];
		}
	}

	return [true];
}

// Add Error Function
function formError(msg){
	// This function shows the error dialogue with the msg variable as its text

	$("form h3").removeAttr("style");
	$("form h3").text(msg);
}

// Form has been submitted
$("form").on("submit",function(event){

	event.preventDefault();

	// Check for any viewable errors
	if(validatePassword()[0]==true){
		// No error

		// Create Email and Password variabled corresponding to the input box values
		var email = $("form input[type='text']:eq(0)").val();
		var password = $("form input[type='password']:eq(0)").val();

		// Differentiate between signup and signin actions
		if(currentPage == "signup"){
			// Sign user up!

			firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password).catch(function(error) {
				// Error with user sign up

				// Create Variable for Error Code
				var errorCode = error.code;
				
				// Show error message for error codes
				if(errorCode == 'auth/email-already-in-use'){
					formError("Email Already in Use");
				}
				if(errorCode == 'auth/invalid-email'){
					formError("Invalid Email");
				}
				if(errorCode == 'auth/operation-not-allowed'){
					formError("Server Error");
				}
				if(errorCode == 'auth/weak-password'){
					formError("Weak Password");
				}

				// Log error to console (for debugging purposes)
				console.log(error);
			});
		}else{
			// Sign user in if no error
			firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				
				if(errorCode == 'auth/invalid-email'){
					formError("Invalid Email");
				}
				if(errorCode == 'auth/user-disabled'){
					formError("Account Disabled");
				}
				if(errorCode == 'auth/user-not-found'){
					formError("No Account with This Email");
				}
				if(errorCode == 'auth/wrong-password'){
					formError("Incorrect Password");
				}
			});
		}
	}else{
		formError(validatePassword()[1]);
	}
});

// When press enter key in email input box, focus password input box rather than submitting

$("form input[type='text']:eq(0)").on("keydown",function(event){
	// If keycode is 13 - 13 is the keycode for the enter key
	if(event.keyCode == 13){
		// Prevent form submission
		event.preventDefault();

		$("form input[type='password']:eq(0)").focus();
	}
});

// When press enter key in first password box in sign up page, focus next password box

if(currentPage == "signup"){
	$("form input[type='password']:eq(0)").on("keydown",function(event){
		// If keycode is 13 - 13 is the keycode for the enter key
		if(event.keyCode == 13){
			// Prevent form submission
			event.preventDefault();

			$("form input[type='password']:eq(1)").focus();
		}
	});
}
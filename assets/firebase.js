// Initialize Firebase
var config = {
	apiKey: "AIzaSyBzG5AOKYPhGpDo2s-59DCpMs0zI75la18",
	authDomain: "ambience-64eea.firebaseapp.com",
	databaseURL: "https://ambience-64eea.firebaseio.com",
	projectId: "ambience-64eea",
	storageBucket: "ambience-64eea.appspot.com",
	messagingSenderId: "494946336054"
};
firebase.initializeApp(config);

// If User Signed In, or Signed Out, trigger url change
firebase.auth().onAuthStateChanged(function(user) {
	if(user){
		// User is signed in (this is saved - remember me is auto-enabled)

		// open main.html in current tab if not already in it

		// uses currentHTMLPage variable defined in HTML file
		if(currentHTMLPage != "main.html"){
			window.open("main.html","_self");
		}
	}else{
		// User is not signed in (signed out)

		// open index.html in current tab if not already in it

		// uses currentHTMLPage variable defined in HTML file
		if(currentHTMLPage != "index.html"){
			window.open("index.html","_self");
		}
	}
});
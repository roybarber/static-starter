import $ from "jquery";

// Setup
window.jQuery = window.$ = $;

// NO JS Fallbacks
$('body').addClass("js");

// Environmental
if(process.env.NODE_ENV === 'development'){
	require("./devonly/dev");
}

// Request to the test endpoints
$.ajax({
	type: 'GET',
	url: '/api/hello',
	dataType: 'json',
	error: function(error) {
		console.error('An error has occurred', error)
	},
	success: function(response) {
		console.log(response);
	}
});
$.ajax({
	type: 'GET',
	url: '/api/name?name=Beth',
	dataType: 'json',
	error: function(error) {
		console.error('An error has occurred', error)
	},
	success: function(data) {
		console.log(data)
	},
});

// Components & Modules
require("./modules/lazyload");
require("./modules/validation");
require("./modules/mobilemenu");

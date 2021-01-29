import $ from "jquery";
const axios = require('axios');

// Setup
window.jQuery = window.$ = $;
var apiURL = '';
// NO JS Fallbacks
$('body').addClass("js");

// Environmental
if(process.env.NODE_ENV === 'development'){
	require("./devonly/dev");
	apiURL = 'http://localhost:8888';
} else {
	apiURL = 'http://netlifyurl.netlify.app';
}

// Request to the test endpoints
axios.get('/api/hello').then((response) => {
	console.log(response.data);
	console.log(response.status);
	console.log(response.statusText);
	console.log(response.headers);
	console.log(response.config);
});
axios.get('/api/name?name=Beth').then((response) => {
	console.log(response.data);
});

// Components & Modules
require("./modules/lazyload");
require("./modules/validation");

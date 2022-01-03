// Create an array and add it into handlebars Data
// Usage: {createArray "myColors" "bg-primary, bg-secondary, bg-blood, bg-banana, bg-peony, bg-green"}}
module.exports.register = function (Handlebars) {
	Handlebars.registerHelper('createArray', function(dataName, theData, options) {
		const array = theData.split(',')
		options.data.root[dataName] = array
	});
};


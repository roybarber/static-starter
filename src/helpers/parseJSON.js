module.exports.register = function (Handlebars) {
	
	Handlebars.registerHelper("parseJSON", function (data, options) {
		return options.fn(JSON.parse(data));
	});

};


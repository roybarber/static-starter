module.exports.register = function (Handlebars) {
	Handlebars.registerHelper('lowerCase', function(arg1) {
		return arg1.replace(/\s/g, '').toLowerCase()
	});
};

/**
 * @param  {Object} `options` The path to the SVG file to inline
 * @return {String}
 */

var fs = require('fs');
var Handlebars = require('handlebars');
var rename = require('rename');
var config = require('../../build/build.config.js');

module.exports = function(options = {}){

	var imageFolder = './build/dist',
		src = Handlebars.escapeExpression(options.hash.src),
		classlist = Handlebars.escapeExpression(options.hash.class),
		
		lastSize = '-' + config.responsivesizes.slice(-1)[0] + 'px',

		largeImage = rename(src, {suffix: lastSize}),

		preloadImage = rename(src, {suffix: '-load'}),
		preloadImage = imageFolder + preloadImage,
		preloadImage = 'data:image/png;base64, ' + fs.readFileSync(preloadImage, 'base64');

	return new Handlebars.SafeString(
		"class='lozad bg-image " + classlist + "' data-background-image='" + largeImage + "' style='" + preloadImage + "'"
	);
}

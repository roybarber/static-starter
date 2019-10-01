/**
 * @param  {Object} `options` The path to the SVG file to inline
 * @return {String}
 */

var fs = require('fs');
var Handlebars = require('handlebars');
var rename = require('rename');
var config = require('../../build/build.config.js');

function swap(object){
	var ret = {};
	for(var key in object){
		ret[object[key]] = key;
	}
	return ret;
}

module.exports = function(options = {}){
	var imageFolder = './build/dev',
		src = Handlebars.escapeExpression(options.hash.src),
		alt = Handlebars.escapeExpression(options.hash.alt),
		classlist = Handlebars.escapeExpression(options.hash.class),
		
		sizes = config.responsivesizes,

		width = Object.keys(sizes)[Object.keys(sizes).length-1],
		width = sizes[width] + 'px',

		originalImage = rename(src, {suffix: '-original'}),

		preloadImage = rename(src, {suffix: '-load'}),
		preloadImage = imageFolder + preloadImage,
		preloadImage = fs.readFileSync(preloadImage, 'base64'),
		
		allimages = {};
		
	// Construct the object of images
	for (var i = 0; i < sizes.length; i++) {
	   allimages[sizes[i]+'w'] = rename(src, {suffix: '-' + sizes[i] + 'px'});
	}
	delete allimages[sizes[0]+'w'];
	allimages = swap(allimages);

	var tempList = Object.entries(allimages);
	var formattedList = [];
	for (var i = 0; i < tempList.length; i++) {
		var string = tempList[i][0] + ' ' + tempList[i][1];
		formattedList.push(string);
	}
	var srcSet = formattedList.join(', ');

	return new Handlebars.SafeString(
		"<img class='" + classlist + "' alt='" + alt + "' width='" + width +"' src='" + preloadImage + "' data-src='" + originalImage + "' data-srcset='" + srcSet + "' data-sizes='(max-width: " + width +") 100vw, " + width +"' srcset='" + srcSet + "' sizes='(max-width: " + width +") 100vw, " + width +"'><noscript><img src='" + originalImage + "' class='" + classlist + "' width='" + width +"' alt='" + alt +"'></noscript>"
	);
}
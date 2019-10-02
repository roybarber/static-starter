// Options - TODO
// Property				Default	
// src					required		Relative path to image file
// width								Resize image to specified width in pixels
// height								Crop & resize image to specified height in pixels
// alt									Alternate text for the image
// fit					"cover"			How to crop images. See properties below.
// background							Background color for 'contain'
// immediate			false			Set to true to disable lazy-loading
// blur					40				How much in px to blur the image placeholder
// quality				75				The quality of the image. (0 - 100).

// #Fit options
// cover				Crop to cover both provided dimensions (default).
// contain				Embed within both provided dimensions.
// fill					Ignore the aspect ratio of the input and stretch to both provided dimensions.
// inside				Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
// outside				Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.

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

	if (!Object.entries) {
		Object.entries = function( obj ){
			var ownProps = Object.keys( obj ),
				i = ownProps.length,
				resArray = new Array(i); // preallocate the Array
			while (i--)
				resArray[i] = [ownProps[i], obj[ownProps[i]]];
			return resArray;
		};
	}


	var imageFolder = './build/dist',
		src = Handlebars.escapeExpression(options.hash.src),
		alt = Handlebars.escapeExpression(options.hash.alt),
		classlist = Handlebars.escapeExpression(options.hash.class),
		
		sizes = config.responsivesizes,

		width = Object.keys(sizes)[Object.keys(sizes).length-1],
		width = sizes[width] + 'px',

		originalImage = rename(src, {suffix: '-original'}),

		preloadImage = rename(src, {suffix: '-load'}),
		preloadImage = imageFolder + preloadImage,
		preloadImage = 'data:image/png;base64, ' + fs.readFileSync(preloadImage, 'base64'),
		
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
		"<figure class='image'><img class='preload responsive' src='" + preloadImage + "'/><img class='lozad " + classlist + "' alt='" + alt + "' width='" + width +"' src='" + preloadImage + "' data-src='" + originalImage + "' data-srcset='" + srcSet + "' sizes='(max-width: " + width +") 100vw, " + width +"'><noscript><img src='" + originalImage + "' class='" + classlist + "' width='" + width +"' alt='" + alt +"' srcset='" + originalImage + "' data-srcset='" + srcSet + "' sizes='(max-width: " + width +") 100vw, " + width +"'/></noscript></figure>"
	);
}
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
		immediateLoad = Handlebars.escapeExpression(options.hash.immediate),

		sizes = config.responsivesizes,

		width = Object.keys(sizes)[Object.keys(sizes).length-1],
		width = sizes[width] + 'px',

		originalImage = rename(src, {suffix: '-original'}),

		preloadImage = rename(src, {suffix: '-load'}),
		preloadImage = imageFolder + preloadImage,
		preloadImage = 'data:image/png;base64, ' + fs.readFileSync(preloadImage, 'base64'),
		
		allimages = {},
		output = '';
		
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

	var lazyOutput = "<figure class='image'><img class='preload responsive' src='" + preloadImage + "'/><img data-toggle-class='active' class='lozad " + classlist + "' alt='" + alt + "' width='" + width +"' src='" + preloadImage + "' data-src='" + originalImage + "' data-srcset='" + srcSet + "' sizes='(max-width: " + width +") 100vw, " + width +"'><noscript><img src='" + originalImage + "' class='" + classlist + "' width='" + width +"' alt='" + alt +"' srcset='" + originalImage + "' data-srcset='" + srcSet + "' sizes='(max-width: " + width +") 100vw, " + width +"'/></noscript></figure>"

	var standardOutput = "<figure class='image'><img src='" + originalImage + "' class='" + classlist + "' width='" + width +"' alt='" + alt +"' srcset='" + originalImage + "' data-srcset='" + srcSet + "' sizes='(max-width: " + width +") 100vw, " + width +"'/></figure>"

	if (immediateLoad){
		output = standardOutput;
	} else {
		output = lazyOutput;
	}

	return new Handlebars.SafeString(output);
}
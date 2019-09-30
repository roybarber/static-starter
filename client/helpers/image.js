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
		
		allimages = {}
		sourceListtemp = '',
		sourceList = '';

	// Construct the object of images
	for (var i = 0; i < sizes.length; i++) {
	   allimages[sizes[i]+'w'] = rename(src, {suffix: '-' + sizes[i] + 'px'});
	}
	delete allimages[sizes[0]+'w'];
	allimages = swap(allimages);
	//console.log(allimages);

	sourceListtemp = JSON.stringify(allimages);
	//console.log('string:', sourceList)

	//console.log(allimages);

	var sourceList = allimages[0];
	//console.log(sourceList);

	return new Handlebars.SafeString(
		"<img alt='" + alt + "' width='" + width +"' src='" + originalImage + "' data-src='" + originalImage + "' data-srcset='" + sourceList + "' data-sizes='(max-width: " + width +") 100vw, " + width +"' class='" + classlist + "' srcset='" + sourceList + "' sizes='(max-width: " + width +") 100vw, " + width +"'><noscript><img src='" + originalImage + "' class='" + classlist + "' width='" + width +"' alt='" + alt +"'></noscript>"
	);
}


//<img 
//	alt="Test image"
//	width="2560"
//	
//	src="/assets/img/site/test-original.jpeg"
//	
//	data-src="/assets/img/site/test.jpeg"
//	data-srcset="/assets/img/site/test-480px.jpeg 480w,
//		/assets/img/site/test-1024px.jpeg 1024w,
//		/assets/img/site/test-1920px.jpeg 1920w,
//		/assets/img/site/test-2560px.jpeg 2560w"
//	data-sizes="(max-width: 2560px) 100vw, 2560px"
//
//	class="responsive g-image g-image--lazy g-image--loaded"
//
//	srcset="/assets/img/site/test-480px.jpeg 480w,
//		/assets/img/site/test-1024px.jpeg 1024w,
//		/assets/img/site/test-1920px.jpeg 1920w,
//		/assets/img/site/test-2560px.jpeg 2560w"
//	sizes="(max-width: 2560px) 100vw, 2560px"
//>
//<noscript>
//	<img
//		src="/assets/img/site/test-original.jpeg"
//		class="responsive g-image g-image--loaded"
//		width="2560"
//		alt="Banana"
//	>
//</noscript>
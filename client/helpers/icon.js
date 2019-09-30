// We have the ability to insert an icon and it compile to inline SVG using:
// {{icon
// 	"activity.svg"
// 	class="icon icon-128 icon-primary" width="24"
// 	height="24"
// 	fill="black"
// 	stroke="red"
// 	stroke-width="4"
// 	stroke-linecap="round"
// 	stroke-linejoin="round"
// }}

/**
 * @param  {String} `icon` The path to the SVG file to inline
 * @param  {Object} `options`
 * @return {String}
 */
var ltx = require('ltx');
var resolve = require('resolve');
var fs = require('fs');
var Handlebars = require('handlebars');

const nameToModule = {};
const cache = {};
function parse (xml) {
    const svg = ltx.parse(xml);
    if (svg.name !== 'svg') {
        throw new TypeError('{{icon}} helper: File specified must be an SVG');
    }
    return svg;
}

module.exports = function(icon, options = {}){
	var icon = '../assets/img/icons/' + icon + '.svg';
	if (typeof icon !== 'string') {
		throw new Error('{{icon}} helper: invalid path. Path must be formatted as a string.');
	}
	let modulePath;
	try {
		modulePath = nameToModule[icon] || (nameToModule[icon] = resolve.sync(icon, {
			extensions: ['.svg']
		}));
	} catch (err) {
		throw new Error(`{{icon}} helper: . ${err}`);
	}
	const content = cache[icon] || (cache[icon] = fs.readFileSync(modulePath, 'utf-8'));
	const svg = parse(content);
	Object.assign(svg.attrs, options.hash);
	return new Handlebars.SafeString(svg.root());
}
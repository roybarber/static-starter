'use strict';
//basic configuration object used by gulp tasks
module.exports = {
  hex2: function(c) {
    c = Math.round(c);
    if (c < 0) c = 0;
    if (c > 255) c = 255;

    var s = c.toString(16);
    if (s.length < 2) s = "0" + s;

    return s;
  },
  color: function(r, g, b) {
    return "#" + this.hex2(r) + this.hex2(g) + this.hex2(b);
  },
  shade: function(col, light) {
    var r = parseInt(col.substr(1, 2), 16);
    var g = parseInt(col.substr(3, 2), 16);
    var b = parseInt(col.substr(5, 2), 16);

    if (light < 0) {
        r = (1 + light) * r;
        g = (1 + light) * g;
        b = (1 + light) * b;
    } else {
        r = (1 - light) * r + light * 255;
        g = (1 - light) * g + light * 255;
        b = (1 - light) * b + light * 255;
    }

    return this.color(r, g, b);
  },
  staticMapGen: function(addr) {
    addr = encodeURI(addr);

    var partA = 'https://maps.googleapis.com/maps/api/staticmap?center=';
  var partB = '&zoom=16&size=640x320&scale=2&maptype=roadmap&markers=color:red%7C'+ addr +'&key=AIzaSyD4MUauqmrZm6bpGmus1aBsZeSlcP2_W1g';

    return partA + addr + partB;
  }
};
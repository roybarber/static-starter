$(function(){
		
	// Lazy Load - https://github.com/ApoorvSaxena/lozad.js
    var observer = lozad('.lozad', {
        threshold: 0.1,
        load: function(el) {
            el.src = el.getAttribute("data-src");
            el.onload = function() {
	          el.classList.add('loaded');
              console.log("Success " + el.localName.toUpperCase() + " " + el.getAttribute("data-index") + " lazy loaded.")
            }
        }
    })
    observer.observe()
	
	// File upload
    $('.file-upload').change(function() {
        var filepath = this.value;
        var m = filepath.match(/([^\/\\]+)$/);
        var filename = m[1];
        $(this).parent('label').siblings('span').html(filename);
    });
    
});
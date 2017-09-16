$(function(){
	var win = $(window),
		doc = $(document),
		body = $('body'),
		$self = $(this);
		
	// File upload
    $('.file-upload').change(function() {
        var filepath = this.value;
        var m = filepath.match(/([^\/\\]+)$/);
        var filename = m[1];
        $(this).parent('label').siblings('span').html(filename);
    });
});
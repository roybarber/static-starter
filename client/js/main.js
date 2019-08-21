$(function () {

	console.log('JS Ready');

	// File upload
    $('.file-upload').change(function() {
        var filepath = this.value;
        var m = filepath.match(/([^\/\\]+)$/);
        var filename = m[1];
        $(this).parent('label').siblings('span').html(filename);
    });

	// JQuery Validation
	$('form.validate').validate({
		rules: {
			email: {
				required: true,
				email: true
			}
		},
		errorElement: 'span',
		// move the errors inline but after any helper messages
		errorPlacement: function (error, element) {
			var placement = $(element).closest('.input-group');
			error = error.addClass('helper-message');
			if (placement) {
				$(placement).append(error);
			} else {
				error.append(element);
			}
		},
		// Other available functions
		////onfocusin: function( element ) {},
		////onfocusout: function( element ) {},
		////onkeyup: function( element, event ) {},
		////onclick: function( element ) {},
		////highlight: function( element, errorClass, validClass ) {},
		////unhighlight: function( element, errorClass, validClass ) {}
	});


});
$(function () {

	function openMobileMenu(){
		$(this).attr('aria-expanded', 'true')
		$("#mobileMenu").show()
		setTimeout(function(){
			$("#closeMobileMenu").focus();
		}, 250)
	}
	function closeMobileMenu(){
		$(this).attr('aria-expanded', 'false')
		$("#mobileMenu").hide()
		setTimeout(function(){
			$("#openMobileMenu").focus();
		}, 250)
	}

	if($("#mobileMenu").length){

		$("#openMobileMenu").on("click", openMobileMenu);
		$("#closeMobileMenu").on("click", closeMobileMenu);

	}

});

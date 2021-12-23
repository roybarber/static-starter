import { validate } from "jquery-validation";

$(function () {

	function getErrorMsg(selector, attribute) {
		console.log(attribute);
		return $(selector).attr(attribute);
	}

	// Custom Password validation
	$.validator.addMethod(
		"password",
		function (value, element) {
			return (
				this.optional(element) ||
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/.test(
					value
				)
			);
		},
		""
	);

	$("form[data-validate]").each(function () {
		// attach to all form elements on page
		$(this).validate({
			rules: {
				email: {
					required: true,
					email: true,
				},
				password: {
					minlength: 8,
				},
				confirmpassword: {
					minlength: 8,
					equalTo: "#password",
				},
			},
			messages: {
				password: getErrorMsg("#password", "data-msg-password"),
				confirmpassword: getErrorMsg(
					"#confirmpassword",
					"data-msg-confirmpassword"
				),
			},
			errorElement: "span",
			// move the errors inline but after any helper messages
			invalidHandler: function (event, validator) {
				// 'this' refers to the form
				var errors = validator.numberOfInvalids();
				if (errors) {
					$(this).addClass("invalid");
				} else {
					$(this).removeClass("invalid");
				}
			},
			errorPlacement: function (error, element) {
				if (element.is("date")) {
					$(this).prev("div").addClass("date-error");
				} else {
					//return true;
					var placement = $(element).closest(".input-group");
					error = error.addClass("helper-message");
					if (placement) {
						$(placement).append(error);
					} else {
						error.append(element);
					}
				}
			},
			showErrors: function (errorMap, errorList) {
				var errors = this.numberOfInvalids(); // <- NUMBER OF INVALIDS
				if (errors) {
					var message =
						errors == 1 ? "Theres an error below, please correct it and try again" : `There are ${errors} errors below, please correct them and try again`;
					$("form.invalid div.formerrors strong").html(message);
					$("form div.formerrors").hide();
					$("form.invalid div.formerrors").show();
				} else {
					$("form.invalid div.formerrors").hide();
				}
				this.defaultShowErrors();
			},
		});
	});
});

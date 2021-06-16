// Form Validation Start
$(function() {
    $("form").FormValidator({
        name: "BulmaValidator"
    });
});

(function ($) {
	$.fn.FormValidator = function (opts) {
		// default configuration
		var config = $.extend({}, {
			classes: {
				danger: "is-danger",
				success: "is-success",
				helptext: "help",
				block: "is-block",
				hidden: "is-hide"
			},
			fields: ["text", "email", "serial"],
			settings: {
				text: {
					regex: "^[A-Za-z ,.'-]|[0-9]{0,35}$"
				},
				email: {
					regex: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
				},
				code_check: {
					audi: {
						regex: "^([aA][uU][zZ].{11})",
						error_message: "Your serial number should start with '<strong>AUZ</strong>', and be 14 digits long."
					},
					chrysler: {
						regex: "^([tT].{13})",
						error_message: "Your serial number should start with '<strong>T</strong>', and be 14 digits long."
					},
					dodge: {
						regex: "^([tT].{13})",
						error_message: "Your serial number should start with '<strong>T</strong>', and be 14 digits long."
					},
					fiat: {
						regex: "^((([bB][pP])|([cC][mM])).{12})|([aA][2][cC].{16})",
						error_message: "Your serial number should start be '<strong>(BP + 12 digits), (CM + 12 digits) or (A2C + 12 digits)</strong>'."
					},
					ford: {
						regex: "^([vV].{6}(?!.))|^([mM].{6}(?!.))|^([cC]7.{15})|^([bB][pP])",
						error_message: "Your serial number should start with '<strong>M, V, C7 or BP</strong>'."
					},
					honda: {
						regex: "^((?!400[0|1]).)*$",
						error_message: "Unfortunately, we cannot decode Honda radios with the serial number starting with '4000' and '4001'."
					},
					jaguar: {
						regex: "^([mM].{6}(?!.))|([jJ][aA].{12})",
						error_message: "Your serial number should start with '<strong>JA</strong>', and be 14 digits long. <br /> Some radios start with '<strong>M</strong>', and be 7 digits long."
					},
					jeep: {
						regex: "^([tT].{13})",
						error_message: "Your serial number should start with '<strong>T</strong>', and be 14 digits long."
					},
					mercedes: {
						regex: "^((?![mM][cC]).)*$",
						error_message: "We cannot decode radio's with serial number starting with 'MC'."
					},
					renault: {
						regex: "[aA-zZ][0-9]{3}|4",
						error_message: "Your serial number should start with a letter followed by 3 digit, and be 4 digits long."
					},
					skoda: {
						regex: "^([sS][kK][zZ].{11})",
						error_message: "Your serial number should start with '<strong>SKZ</strong>', and be 14 digits long."
					},
					vw: {
						regex: "^([vV][wW][zZ].{11})",
						error_message: "Your serial number should start with '<strong>VWZ</strong>', and be 14 digits long."
					}
				}
			}
		}, opts);

		var manu = $(location).attr('pathname').replace(/^\/([^\/]*).*$/, '$1');
				manu = manu.split("-")[0];
		
		function productRegex(product) {
			return new RegExp(config.settings.code_check[product].regex);
		}
		function productMessage(product) {
			return config.settings.code_check[product].error_message;
		}

		// main function
		function Validate($e) {
			var fieldtype = $e.attr('type');
			
			if(fieldtype === 'serial') {

				var serial;
				if(manu === 'ford') {
					serial = $e.val().replace(/[Oo]/g, '0');
				} else {
					serial = $e.val();
				}

				if (productRegex(manu).test(serial)) {
					
					$e.removeClass(config.classes.danger)
						.addClass(config.classes.success)
						.attr("data-validation-error", "false")
						.parent().siblings("." + config.classes.helptext).removeClass(config.classes.block)
						.parent().siblings("." + config.classes.helptext).addClass(config.classes.hidden)

				} else {
					$e.removeClass(config.classes.success)
						.addClass(config.classes.danger)
						.attr("data-validation-error", "true")
						.parent().siblings("." + config.classes.helptext).html(productMessage(manu)).addClass(config.classes.block)
						.parent().siblings("." + config.classes.helptext).removeClass(config.classes.hidden)

				}
			} 
		}

		function ValidateAll($form) {
			$form.find("input").each(function (index, element) {
				var $element = $(element);
				if ($.inArray($element.attr('type'), config.fields) !== -1) {
					Validate($element);
				}
			});
		}

		var $form = this;

		$form.submit(function (e) {
			e.preventDefault();
			ValidateAll($form);
			var getInput;
			if(e.currentTarget[0].id == 'starts-with') {
				getInput = e.currentTarget[1];
			} else {
				getInput = e.currentTarget[0];
			}
			if(getInput.classList.contains('is-success')) {
				$(this)[0].submit();
			}
		})

		return this;
	};
})(jQuery);
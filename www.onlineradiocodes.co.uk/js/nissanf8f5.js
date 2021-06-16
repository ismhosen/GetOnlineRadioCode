$('.buy-box').on('submit', function(e) {
    var amount = $('input[name="amount"]', this).val();
    paymentReqBut(amount);

    var serial = $('.radio-serial', this).val(),
        email = $('input[type=email]', this).val();

    $("input[name=custom]", this).val(serial + "/" + email);

    if ($(this).hasClass('checkGM')) {
        var gmInput = $('.vx-serial', this).val(),
            gmReg = /^[Gg][Mm].*/g;
        if (gmReg.test(gmInput)) {
            sweetAlert({
                title: "Oops...",
                text: "<p>Unfortunately, we cannot decode Vauxhall radios with the serial number starting with 'GM'.</p>",
                html: true,
                type: "error"
            });
        }
    }

    $('.overlay').fadeIn(200);
    $('.payment-popup').addClass('active');
    $('body').addClass('fixed-body');
    $("#intercom-container").addClass("hide-intercom");

    var obj = {
        title: $('[data-type-get="title"]').text(),
        price: $('[data-type-get="price"]', this).val(),
        email: $('[data-type-get="email"]', this).val(),
        serial_1: $('[data-type-get="serial-1"]', this).val(),
        serial_2: $('[data-type-get="serial-2"]', this).val(),
        serial_3: $('[data-type-get="serial-3"]', this).val(),

    };

    var inputserial = $("[data-type-get*='serial']", this),
        serial = $('.product-checker__serial');

    for (var i = 0; i < inputserial.length; i++) {
        var element = inputserial[i].value;
        if (element.length > 0) {
            $(serial[i]).show();
        }
    }

    $('[data-text-set="title"]').text(obj.title);
    $('[data-text-set="price"]').text(obj.price);
    $('[data-text-set="email"]').text(obj.email);
    $('[data-text-set="serial-1"]').text(obj.serial_1);
    $('[data-text-set="serial-2"]').text(obj.serial_2);
    $('[data-text-set="serial-3"]').text(obj.serial_3);

    $('[data-val-set="title"]').val(obj.title);
    $('[data-val-set="price"]').val(obj.price);
    $('[data-val-set="email"]').val(obj.email);
    $('[data-val-set="serial-1"]').val(obj.serial_1);
    $('[data-val-set="serial-2"]').val(obj.serial_2);
    $('[data-val-set="serial-3"]').val(obj.serial_3);

    var ppBtn = $('#paypal__btn'),
        val = $(this).data('value');

    ppBtn.on('click', function(e) {
        var box = $('.buy-box');
        for (var i = 0; i < box.length; i++) {
            var el = box[i];
            if ($(el).data('value') === val) {
                $(el)[0].submit();
            }
        }
    });

    $(this).parents('.modal-popup__wrap').removeClass('active');
    return;
});
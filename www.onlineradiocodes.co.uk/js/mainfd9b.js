jQuery(document).ready(function($) {


    $('.js-menu').on('click', function(e) {
        e.preventDefault();

        var $this = $(this);

        $('.mobile-navigation').addClass('active');
        $('body').addClass('show-overlay');

    });

    if ($(window).width() < 960) {

        $('.left-msg').insertAfter('.center-msg');

        function summarySlider($slider, count) {
            var wWidth = $(window).width(),
                itemWidth = wWidth;
            itemList = $slider.find('.msg');
            $slider.css('width', itemWidth * itemList.length);
            $(itemList).css({
                'visibility': 'visible',
                'opacity': '1',
                'width': itemWidth,
                'transform': 'translate3d(-' + itemWidth * count + 'px,0,0)'
            });
        }

        $('#CarouselPreHeader').each(function(index) {

            var count = 0;
            var $slider = $(this); // to pass to `summarySlider()`
            var limit = $(this).find('.msg').length;

            setInterval(function() {
                if (count === limit) {
                    count = 0;
                }
                summarySlider($slider, count);
                count++;
            }, 2500);
        });

    }

    

    $('.close-cross').on('click', function() {
        $('body').removeClass('show-overlay');
        $('.mobile-navigation').removeClass('active');
    });

    $('#buy-box').on('submit', function(e) {
        e.preventDefault();
        var amount = $('input[name="amount"]', this).val();
        paymentReqBut(amount);
        if ($('.js-serial').length === 0) {
            if ($('#buy-box.vw-chck').length === 1) { // Does the class of .vw-chck exist
                var vwReg = /[vV][wW][zZ]([1-4]|6)[zZ]7[A-Za-z0-9]*/g,
                    vwSer = $('.vw-rns').val();
                if (vwReg.test(vwSer)) {
                    if ($('#BuyBoxScope')) {
                        $('.vw-rns').after('<span class="error">Please purchase VW Navigation radio codes <a href="vw-rns-510-radio-codes">here</a></span>');
                        $('.vw-rns').addClass('error');
                        return;
                    } else {
                        sweetAlert({
                            title: "Oops...",
                            text: "<p>The radio code you entered is for a VW navigation system, for these we need to connect to the German decoding servers, please purchase from <a href=/vw-rns-510-radio-codes><strong>here</strong></a>.</p>",
                            html: true,
                            type: "error"
                        });
                    }

                } else {
                    showStripe();
                }
            }

            if ($('#buy-box.hondaCheck').length === 1) {
                var hondaInput = $('.honda-radio-serial').val(),
                    hondaReg = /^4([0-9]).*/g;
                if (hondaReg.test(hondaInput)) {
                    sweetAlert({
                        title: "Oops...",
                        text: "<p>Unfortunately, we cannot decode Honda radios with the serial number starting with '4000' and '4001'.</p>",
                        html: true,
                        type: "error"
                    });
                    return false;
                } else {
                    $(this)[0].submit();
                    showStripe();
                }
            }

            if ($('#buy-box.checkGM').length === 1) {
                var gmInput = $('.vx-serial').val(),
                    gmReg = /^[Gg][Mm].*/g;
                if (gmReg.test(gmInput)) {
                    e.preventDefault();
                    sweetAlert({
                        title: "Oops...",
                        text: "<p>Unfortunately, we cannot decode Vauxhall radios with the serial number starting with 'GM'.</p>",
                        html: true,
                        type: "error"
                    });
                    return false;
                } else {
                    $(this)[0].submit();
                }
            }

            if ($('.checkStripe').length === 1) {
                showStripe();
            } else if(!$(this).hasClass('bb-2021')) {
                console.log('true');
                $(this)[0].submit();
            }
        } else {
            // curSel = $('form#buy-box .options select option:selected').data('serial');
            curSer = $('form#buy-box .js-serial').val().toUpperCase();

            if (curSer) {
                if ($(this).hasClass('checkStripe')) {
                    showStripe();
                } else {
                    $(this)[0].submit();
                }
            }
            // } else {
            //     sweetAlert("Oops...", "It seems you have selected a serial that starts with '" + curSel + "' when your serial begins with '" + curSer + "'. Please ammend before proceeding.", "error");
            // }
        }

    });

    function showStripe() {

        $('.overlay').fadeIn(200);
        $('.payment-popup').addClass('active');
        $('body').addClass('fixed-body');
        $("#intercom-container").addClass("hide-intercom");

        var obj = {
            title: $('[data-type-get="title"]').text(),
            price: $('[data-type-get="price"]').val(),
            email: $('[data-type-get="email"]').val(),
            serial_1: $('[data-type-get="serial-1"]').val(),
            serial_2: $('[data-type-get="serial-2"]').val(),
            serial_3: $('[data-type-get="serial-3"]').val(),

        };

        var inputserial = $("[data-type-get*='serial']"),
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

        $('#paypal__btn').on('click', function(e) {
            $('#buy-box')[0].submit();
        });

        return;
    }
    $('.payment-popup .close').on('click', function(e) {
        e.preventDefault();
        $('.payment-popup').removeClass('active');
        $('.overlay').fadeOut(200);
        $('body').removeClass('fixed-body');
        $("#intercom-container").removeClass("hide-intercom");
    });
    $('.opt-card').on('click', function(e) {
        e.preventDefault();
        $('.stripe-option').slideDown();
        $(this).fadeOut();
        $('.cc-usr').focus();
    });
    $('h5.faq-title, .acc-title').on('click', function() {
        $this = $(this);
        $this.find('i').toggleClass('fa-plus fa-minus');
        $this.next('div, ul').slideToggle();
    });

    $('#PayByCard').on('click', function() {
        $('.stripe-option').slideDown();
    });

    $('#contact-submit').submit(function(event) {
        var formData = {
            'fname': $('#first-name').val(),
            'lname': $('#last-name').val(),
            'email': $('#email-address').val(),
            'subject': $('#subject').val(),
            'message': $('#message').val()
        };
        $.ajax({
            url: 'mail.php',
            type: 'POST',
            dataType: 'html',
            data: formData,
        }).done(function(data) {
            console.log(data);
            if (data === "Message Sent") {
                $(".success-message").fadeIn();
                $('#contact-submit input,#contact-submit textarea').each(function() {
                    $(this).val('');
                });
            }
        }).fail(function(data) {
            if (data.status === 400) {
                var msg = $('<span/>');
                msg.text(data.responseText);
                $(".error-message").append(msg).fadeIn();
            }
        }).always(function() {
            $('html body').animate({
                scrollTop: 0
            }, 'slow');
        })
        event.preventDefault();
    });
    $('.step-content > div').hide();
    $('.step-content > div:first-of-type').show();
    if ($(window).width() < 959) {
        $('.step-content > div:first-of-type').hide();
    }
    $('#step-tabs li').click(function(e) {
        e.preventDefault();
        var $this = $(this),
            target = $this.children().attr('href'),
            tabs = $this.closest('ul').children('li'),
            hTabs = $this.parent().next().children();
        tabs.removeClass('active');
        $this.addClass('active');
        $(hTabs).hide();
        $(target).show();
    });
    $('.req-btn, .step-content > h3').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('req-btn')) {
            if ($(window).width() > 959) {
                $('#grc').trigger('click');
                $('html,body').animate({
                    scrollTop: $("#step-cont").offset().top
                }, 1000);
            } else {
                tabs($(this), 'tab-2');
            }
        } else {
            tabs($(this), $(this).attr('rel'));
        }
    });

    function tabs(obj, tabId) {
        if (obj.hasClass('req-btn')) {
            var draw = $('#tab-2'),
                h3 = $('h3[rel="tab-2"]');
            if (!h3.hasClass('active') && $(window).width() < 959) {
                draw.slideToggle();
                h3.addClass('active');
            }
            $('html, body').animate({
                scrollTop: $("#tab-2").offset().top
            }, 1000);
        } else {
            var draw = obj.next('div');
            draw.slideToggle();
            obj.toggleClass('active');
        }
    };
    $('.fordv').one('click', function() {
        var checkV = /[vV][0-9]{6}/g,
            vSer = $('.chckV').val();
        if (checkV.test(vSer)) {
            var desc = $('#i_s').attr("value");
            $('#i_s').attr("value", desc + " IRCSAT");
        }
    });

    // Instant Code + email added to all custom fields
    $('.buyCode').on('click', function(e) {
        var serial = $('.radio-serial').val(),
            email = $('input[type=email]').val(),
            re = /(([Mm]\d{6}(?!.))|(^[Jj]\w{13}(?!.))|(^[aA-zZ]\d{3}(?!.)))/, // Check if M/Ren or Jag
            slash = window.location.pathname.replace("/", ""),
            name = slash.replace("-", " "),
            price = $('[data-type-get="price"]').val();

        if ($(this).hasClass('fordv')) {
            var fordSerial = serial.replace(/o/g, '0');
            $("input[name=custom]").val(fordSerial + "/" + email);
        } else {
            $("input[name=custom]").val(serial + "/" + email);
        }

        if (re.test(serial)) {
            $('.iS').attr("value", function() { return $(this).attr("value") + " IRCSAT" });
        }

        //  pass active cart to db
        $.post("../cart/active-cart.php", {
            email: email,
            serial: serial,
            item_name: name,
            amount: price
        });
    });

    $(document).on('click', '.selects', function(e) {

        e.preventDefault();

        $('.get-code-page .input-field').val("");

        $('.selects').removeClass('selected');

        $(this).addClass('selected');

        var pHolder = $(this).data('placeholder');

        $('#radio-serial').attr('placeholder', pHolder);

        $('#PPAmount').attr('value', $(this).data('price'));

    });

    var allPanels = $(".accordion--menu"),
        lastitem = "",
        accButton = $(".accordion--menu__button");
    accButton.on("click", function() {
        var $this = $(this);

        allPanels.slideUp(); // on click hide all the panels
        if ($this.text() != lastitem) {
            // if this text is not equal to none then run statement
            $this.next().slideDown(); // slide down relevant container
            lastitem = $this.text(); // reset the variable to contain text
            accButton.removeClass('active');
        } else {
            lastitem = "";
        }
        $this.toggleClass("active");
        return false;
    });

    $('.read-more-reviews-home').on('click', function(e) {
        e.preventDefault();
        var widget = $('#carousel-widget');
        $(this).toggleClass('clicked');
        if (widget.css('display') === 'none') {
            widget.slideDown();
        } else {
            widget.slideUp();
        }
    });

    $(document).on('click', '.cross', function(e) {

        e.preventDefault();

        var e = $(this);

        if (e.data('val') === 'close') {

            $('.popout').fadeOut(300);
            $('.phone-closed').fadeOut(300);

            $('.overlay').fadeOut(500);

        };

    });

    var now = new Date(),
        day = now.getDay(),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        myTime = ('0000' + (hours * 100 + minutes)).slice(-4);
        time = parseInt(myTime);

    var usrLocation = $(location).attr('pathname').substring(1),
        pathReg = /\w*/g,
        pageLoc = pathReg.exec(usrLocation);

    if ((time > 0900 && time < 1630) && (day >= 1 && day <= 6)) {

        $.getJSON('manufactures.json', function(data) {

            $.each(data, function(key, val) {
                if (pageLoc == key) {
                    var prodDel = $('#time-val').html(val);
                }
            });
        });

        if ($(window).width() < 960) {
            $('.call-header-mob').show();
        }

        $(".prod-delivery-time").children().fadeIn('slow');

        $('.time-to-show').show();
        $('.livechat--pulse').attr('class', 'open pulse livechat--pulse')
        $('.phone--pulse').attr('class', 'open pulse phone--pulse')

    } else {
        if (pageLoc[0] === 'ford' || pageLoc[0] === 'renault' || pageLoc[0] === 'jaguar') {
            $(".prod-delivery-time span").html("Estimated Delivery Time: <i class='fa fa-bolt' aria-hidden='true'></i> Instant").fadeIn('slow');
        } else {
            $(".prod-delivery-time span").html("<i class='fa fa-car show' style='color:white;'></i> 250,000 Happy Customers &amp; Counting...").fadeIn('slow');
        }

        $('.time-to-show').hide();

        $('.livechat--pulse').attr('class', 'closed pulse livechat--pulse');
        $('.phone--pulse').attr('class', 'closed pulse phone--pulse');
        $('.phone--pulse').next().text('Offline');

        if ($(window).width() < 960) {

            $('a.phone').on('click', function(e) {
                e.preventDefault();

                $('.phone-closed').fadeIn(300);

            });
        };

    }

    if ((time >= 9 && time < 17)) {

        $.getJSON('manufactures.json', function(data) {
            var itm = $('#itm').text(),
                manu = itm.replace(/ .*/, '').toLowerCase();

            $.each(data, function(key, val) {
                if (manu == key) {
                    $('#eta').html(val);
                }
            });

        });

    } else {
        $('#timescale').hide();
    }

    modalBtn = $('.modal-button');
    modalCloseBtn = $('.modal-close');
    modal = $('.modal');
    body = $('body');

    function openModal(e) {
        // e.preventDefault();
        // body.addClass('is-open');
        var whichpopup = $(this).attr('data-popup');
        if(whichpopup == "menu"){
            $(".modal-body-manu").load("../partials/load-a-manu.php");
        }
        $('.modal-popup__wrap[data-popup=' + whichpopup + ']').addClass('active');
        $('.overlay').show();
        $('body').addClass('fixed-body');

        if ($(this).is('.mobile-show-info')) {
            $('section#SectionBlock_1').addClass('active');
        }
        if ($(this).is('.mobile-section__btn')) {
            $(this).next('section[data-popup=product-desc]').addClass('active');
        }
    }

    function closeModal(e) {
        // e.preventDefault();
        $('.modal-popup__wrap').removeClass('active');
        $('.overlay').hide();
        $('body').removeClass('fixed-body');
        if ($(this).hasClass('close__icon')) {
            $('.select-option__anchor').removeClass('active');
            $(this).parents('.mobile-section').removeClass('active');
        }
    }


    modalBtn.on('click', openModal);
    modalCloseBtn.on('click', closeModal);

    $('.close-po').on('click', function() {
        if ($(this).hasClass('close')) {
            if ($(window).width() < 960) {
                $('.tab-content').fadeOut();
            }
        }
    });

    if ($(window).width() < 600) {
        $('.trustpilot-widget').attr('data-style-width', '100%;');
        $('.trustpilot-widget').attr('data-style-height', '100%;');
    }

    // Tab system
    const tabC = $('.tab-content');
    $('.tab-button').on('click', function(e) {
        // e.preventDefault();
        const $this = $(this),
            tab = $this.data('tab');

        tabC.hide();

        // Change button states
        $this.parents('.tab-buttons__cont').find('.tab-button').removeClass('active');
        $this.addClass('active');

        $('.tab-content[data-tab=' + tab + ']').fadeIn();

        if ($(this).is('.select-option__anchor')) {
            $('.select-option__anchor').removeClass('active');
            $('.select-option__anchor[data-tab=' + tab + ']').addClass('active');
        }
    });

    $('.read-more__btn').on('click', function() {
        $(this).parents('.restricted-h').addClass('full-h');
        $(this).parent().hide();

    });

    $('.close__line-btn').on('click', function() {
        $(this).toggleClass('clicked');
        $(this).find('.faq-content').slideToggle();
    });

    $('#WriteReview').on('click', function(e) {
        e.preventDefault();
        $('#WriteReviewSection').addClass('active');
        $('.restricted-h').removeClass('full-h');
    });

    $('#CloseReviewSection').on('click', function(e) {
        $('#WriteReviewSection').removeClass('active');
        $('.read-more-bar').show();
    });

    $('.scrollTopBtn').on('click', function() {
        $(window).scrollTop(0);
        window.setTimeout(function() {
            $('#radio-serial').focus();
        }, 0);
    });

    $('#TidioBtn').on('click', function() {
        $('#tidio-chat').show();
        tidioChatApi.open();
    });

    $('#review-form').on('submit', function(e) {
        e.preventDefault();
        var reviewData = {
            'rating': $('input[name="rating"]').val(),
            'name': $('input[name="name"]').val(),
            'review': $('textarea[name="review"]').val()
        };
        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: reviewData,
            success: function(response) {
                $resp = JSON.parse(response);
                if ($resp.status == 'error') {
                    $('.title-review-h4').after('<span class="msg error"><i class="fa fw fa-exclamation-circle" aria-hidden="true"></i>' + $resp.msg + '</span>');
                }
                if ($resp.status == 'success') {
                    $('.title-review-h4').after('<span class="msg success"><i class="fa fw fa-check" aria-hidden="true"></i>' + $resp.msg + '</span>');
                }
            }
        });
    });

    const smallFrom = $('.small-from'),
        priceElem = $('#price');

    var placeholder;

    if ($(".code__options")[0]) {

        $('#starts-with').on('change', function(e) {
            e.preventDefault();
            const $this = $(this),
                price = $this.val();

            placeholder = $this.find(':selected').data('placeholder');

            if (price) {
                $('.option__2').fadeIn().find('#radio-serial').focus();                
                $('#radio-serial').attr('data-placeholder', placeholder);
                rotatePlaceholder();
                smallFrom.fadeOut();
                priceElem.text(price);

                $('#PPAmount').attr('value', price);
            }
        });

        $('.code__options .close').on('click', function() {
            $(this).parents('.option__2').fadeOut();
            smallFrom.fadeIn();
            $('#radio-serial').attr('data-placeholder', "");
            $('#radio-serial').attr('placeholder', "");
            $('#starts-with').val($("#starts-with option:first").val());
            $('#price').text($("#starts-with option:nth-child(2)").val());
        });

        $('#mutiple-options').on('change', function (e) {
            e.preventDefault();
            var option = $(this),
                price = option.val();
                selected = option.find('option:selected'),
                optionData = selected.data('option');

            $('.buy-box__group').find('#radio-serial').attr('name', '');
            $('.buy-box__group').find('#radio-model').attr('name', '');
            $('.buy-box__group').find('#radio-date').attr('name', '');
            $('.buy-box__group').hide();

            smallFrom.fadeOut();
            $('.option__2').fadeIn().find('#radio-serial').focus();
            priceElem.text(price);
            $('#PPAmount').attr('value', price);

            $('.buy-box__group[data-group="' + optionData + '"]').show().find('#radio-serial').attr('name', 'serial');
            $('.buy-box__group[data-group="' + optionData + '"]').show().find('#radio-model').attr('name', 'model');
            $('.buy-box__group[data-group="' + optionData + '"]').show().find('#radio-date').attr('name', 'date');
            $('.buy-box__multiple--options').slideDown();
            
        });

    } else {
        rotatePlaceholder();
    }

    function rotatePlaceholder() {
        placeholder = $('#radio-serial').data('placeholder');
        if (placeholder) {
            var pHolder = placeholder.split(',');
            var n = 0;
            var loopLength = pHolder.length;
            var interval =
                setInterval(function run() {
                    if (n < loopLength) {
                        var newPlaceholder = pHolder[n];
                        n++;
                        $('.ford-placeholder').attr('placeholder', newPlaceholder);
                    } else {
                        $('.ford-placeholder').attr('placeholder', pHolder[0]);
                        n = 0;
                    }
                    return run;
                }(), 2000);

            $('.option__2 .close').on('click', function() {
                clearInterval(interval);
                return;
            });
        }
    }
    if ($('.play-youtube-video').length) {
        $('.play-youtube-video').on('click', function() {
            var $this = $(this);
            var data = $this.parent().data('yt-url');
            $this.parent().html('<iframe width="100%" height="315px" allowfullscreen frameborder="0" class="embed-responsive-item" src="' + data + '"></iframe>');
        });
    }
});


$('.lc---tidio').on('click', function() {
    $('#tidio-chat').show();
});

$('#toTheTop').on("click",function(e) {
    $('html, body').animate({
        scrollTop: 0
    }, 800);
    return false;
});

var scrollObject = {};
var stickyOptions = document.querySelector('.sticky-options');
window.onscroll = getScrollPosition;

function getScrollPosition(){
	scrollObject = {
		x: window.pageXOffset,
		y: window.pageYOffset
	}
	if(scrollObject.y > 600) {
		stickyOptions.classList.add("active");
	} else {
		stickyOptions.classList.remove("active");
	}
}

var money = document.querySelector('.money');
var selectbox = document.querySelector('select');
var priceinput = document.querySelector('.box-wrap.buy .getElem');
var moneyupdate;

if (document.querySelector('.hero-image') !== null) {
	if (selectbox) {
		var moneyupdate = document.querySelector('#price').textContent;
		money.innerHTML = "From £" + moneyupdate;
	} else {
		var moneyupdate = document.querySelector('#PPAmount').value;
		money.innerHTML = "£" + moneyupdate;
	}
} else if (document.querySelector('.price-banner') !== null) {
    money.innerHTML = "From £9.99";
} else {
	if (priceinput) {
		var moneyupdate = priceinput.value;
		money.innerHTML = "£" + moneyupdate;
	} else {
        var moneyupdate = selectbox.value;
        money.innerHTML = "From £" + moneyupdate;
	}
}
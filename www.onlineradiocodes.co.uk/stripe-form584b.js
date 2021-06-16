/**************
    API Key
***************/

var stripe = Stripe("pk_live_ISBGnoY6QJLNsYnOBz2f745W");
// live key: pk_live_ISBGnoY6QJLNsYnOBz2f745W
// test key: pk_test_iBzmBC08TnF28J4ndta8RGRk

/****************************
    Standard Card Payment
*****************************/

var elements = stripe.elements();
// Custom styling can be passed to options when creating an Element.
var style = {
    base: {
        fontSize: '16px',
        lineHeight: '24px'
    }
};

var card = elements.create('card', {
    style: style,
    hidePostalCode: true
});

card.mount('#card-element');

card.addEventListener('change', function(e) {
    var displayError = document.getElementById('card-errors');
    if (e.error) {
        displayError.textContent = e.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to server
            stripeTokenHandler(result.token);
        }
    });
});

function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    triggerSpinner();
    form.submit();
}

function triggerSpinner() {
    var button = document.getElementById("pay-secure");
    button.setAttribute("disabled", true);
    button.innerHTML = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Processing...</span>";
}

/******************************
    Payment Request Button
******************************/

function paymentReqBut(amount) {
    var $selectAmt = $('select[name=amount]'),
        inputAmt = amount,
        $inputAmtCheckout = $('input[name=amount]');
    if ($selectAmt.length) {
        var price = $selectAmt.val();
    } else if (inputAmt.length) {
        var price = inputAmt;
    } else {
        var price = $inputAmtCheckout.val();
    }

    var intValue = price.split('.');
    var pPrice = parseInt(intValue.join(''));
    var prodTitle = $('h1').text();
    var paymentRequest = stripe.paymentRequest({
        country: 'GB',
        currency: 'gbp',
        total: {
            label: prodTitle,
            amount: pPrice,
        },
        requestPayerEmail: false
    });

    var elements = stripe.elements();
    var prButton = elements.create('paymentRequestButton', {
        paymentRequest: paymentRequest,
        style: {
            paymentRequestButton: {
                height: '52px',
            },
        },
    });

    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment().then(function(result) {
        if (result) {
            prButton.mount('#payment-request-button');
            document.getElementById('payment-request-button__wrap').style.display = 'block';
        } else {
            document.getElementById('payment-request-button__wrap').style.display = 'none';
        }
    });

    paymentRequest.on('token', function(ev) {
        var pEmail = $("input[name='email']").val(),
            pSerial = $("input[name='serial']").val(),
            pModel = $("input[name='model']").val(),
            pDate = $("input[name='date']").val();
        var data = {
                token: ev.token.id,
                amount: pPrice,
                item_name: prodTitle,
                email: pEmail,
                serial: pSerial,
                model: pModel,
                date: pDate
            } // Send the token to your server to charge it!
        var fd = new FormData();
        for (var i in data) {
            fd.append(i, data[i]);
        }
        fetch('payment-requests', {
            method: 'POST',
            body: fd
        }).then(function(res) {
            return res.json();
        }).then(function(data) {
            if (data.status == "success") {
                window.location.href = data.redirect;
                ev.complete('success');
            } else {
                ev.complete('fail');
            }
        })
    });
}

// var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
// var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// if (isSafari && iOS) {
//     alert("You are using Safari on iOS!");
// } else if (isSafari) {
//     alert("You are using Safari.");
// }
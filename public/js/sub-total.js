// https://codepen.io/gabrieleromanato/pen/CqIdh

var Cart = {
    $cart: $("#cart"),
    $qtyFields: $("input.item-quantity"),
    $triggerBtn: $("#calc"),
    $subTotalEl: $("#subtotal"),

    fetchData: function () {
        var self = this;
        var url = 'https://api.myjson.com/bins/19ynm&callback=callbackFN';

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                $.each(data.productsInCart, function (idx, val) {
                    if (val.hasOwnProperty('p_price')) {
                        val.p_originalprice = val.p_originalprice.toFixed(2);
                        val.p_price = val.p_price.toFixed(2);
                    }
                });
                var template = Handlebars.compile($('#template').html());
                var temp = template(data);
                $(document.body).append(temp);
                $('.edit').on('click', function () {
                    self.overlay(data);
                });
                self.calculate(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    overlay: function (data) {
        var template = Handlebars.compile($('#overlayModal').html());
        var temp = template(data);
        $('.overlay').append(temp);

        var modal = $('#myModal');
        var btn = $('.edit');
        var overlay = $('.overlay');

        var span = $('.close')[0];
        overlay.removeClass('hidden');

        // $(document).off().on('click','.edit', function() {
        //     overlay.removeClass('hidden');
        // });

        $(document).off().on('click', '.close', function () {
            overlay.addClass('hidden');
        });

        $(document).on('click', function (event) {
            if (event.target == modal) {
                overlay.addClass('hidden');
            }
        });
    },

    calculate: function (data) {
        var self = this;
        var total = 0;
        var estTotal = 0;
        $.each(data.productsInCart, function (idx, val) {
            if (val.hasOwnProperty('p_price')) {
                total += Number(val.p_price);
            }
        });

        var numberOfItems = data.productsInCart.length;
        var discount;
        if(numberOfItems === 3) {
            discount = 5;
        } else if(numberOfItems > 3 && numberOfItems <= 6) {
            discount = 10;
        } else if(numberOfItems > 10) {
            discount = 25;
        }

        $('.promo-code-amount').text('-'+discount+'%');
        $('.sub-amount').text('$' + total.toFixed(2));

        estTotal = total - ((total/100) * discount);

        $('.estimated-total').text('$'+estTotal.toFixed(2));

    },


    init: function () {
        this.fetchData();
    }
};

$(function () {
    Cart.init();
});
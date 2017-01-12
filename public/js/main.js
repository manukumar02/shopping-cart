
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
                $(document).find('.container').empty().append(temp);
                $('.edit').on('click', function ($el) {
                    var selectedProduct = Number($($el.currentTarget).attr('data-product'));
                    self.overlay(data, selectedProduct);
                });
                self.calculate(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    overlay: function (data, selectedProduct) {
        var index = selectedProduct -1;
        var data = data.productsInCart[index];
        var template = Handlebars.compile($('#overlayModal').html());
        var temp = template(data);
        $('.overlay').append(temp);

        var modal = $('#myModal');
        var btn = $('.edit');
        var overlay = $('.overlay');

        overlay.removeClass('hidden');

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
        var discount = 0;
        var discountAmount = 0;
        if(numberOfItems === 3) {
            discount = 5;
        } else if(numberOfItems > 3 && numberOfItems <= 6) {
            discount = 10;
        } else if(numberOfItems > 10) {
            discount = 25;
        }

        discountAmount = (total/100) * discount;

        $('.promo-code-amount').html('-<sup>$</sup>'+discountAmount.toFixed(2));
        $('.sub-amount').html('<sup>$</sup>' + total.toFixed(2));

        estTotal = total - ((total/100) * discount);

        $('.estimated-total').html('<sup>$</sup>'+estTotal.toFixed(2));

    },


    init: function () {
        this.fetchData();
    }
};

$(function () {
    Cart.init();
});

var Cart = {

    fetchData: function () {
        var self = this,
            template = '',
            temp = '',
            selectedProduct = 0,
            $mainContainer = $('.container'),
            url = 'http://api.myjson.com/bins/19ynm&callback=callbackFN';

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
                self.getHandlebarTemplate('cart-home-page.hbs', $mainContainer, data);
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    overlay: function (selectedProduct) {
        var self = this,
            jsonData = {},
            modal = $('#myModal'),
            btn = $('.edit'),
            overlay = $('.overlay');

        $.ajax({
            url: 'http://api.myjson.com/bins/19ynm&callback=callbackFN?',
            success: function (result) {
                $.each(result.productsInCart, function (idx, val) {
                    if (result.productsInCart[idx].p_id = selectedProduct) {
                        jsonData['productsInCart'] = result.productsInCart[idx];
                    }
                });
                self.getHandlebarTemplate('overlay.hbs', overlay, jsonData);
            }
        });

        overlay.removeClass('hidden');

        $(document).off().on('click', '.close', function () {
            overlay.addClass('hidden');
        });

        $(document).on('click', function (event) {
            if (event.target === modal) {
                overlay.addClass('hidden');
            }
        });
    },

    calculate: function (data) {
        var self = this,
            total = 0,
            estTotal = 0,
            numberOfItems = 0;

        $.each(data.productsInCart, function (idx, val) {
            if (val.hasOwnProperty('p_price')) {
                total += Number(val.p_price);
            }
        });

        numberOfItems = data.productsInCart.length;
        self.disCountLogic(numberOfItems, total);

        $('.sub-amount').html('<sup>$</sup>' + total.toFixed(2));
        estTotal = total - ((total / 100) * self.disCountLogic(numberOfItems, total));
        $('.promo-code-amount').html('-<sup>$</sup>' + self.disCountLogic(numberOfItems, total));
        $('.estimated-total').html('<sup>$</sup>' + estTotal.toFixed(2));
    },

    disCountLogic: function (items, total) {
        var discount = 0;
        var discountAmount = 0;
        if (items === 3) {
            discount = 5;
        } else if (items > 3 && items <= 6) {
            discount = 10;
        } else if (items > 10) {
            discount = 25;
        }

        discountAmount = (total / 100) * discount;
        return discountAmount.toFixed(2);
    },

    getHandlebarTemplate: function (path, target, data) {
        var self = this,
            source,
            template,
            temp;

        $.ajax({
            url: path,
            success: function (res) {
                source = res;
                template = Handlebars.compile(source);
                target.html(template(data));
                self.registerEventHandler();
                self.calculate(data);
            }
        });
    },
    registerEventHandler: function () {
        var self = this;
        $(document).off().on('click', '.edit', function ($el) {
            var selectedProduct = Number($($el.currentTarget).attr('data-product'));
            self.overlay(selectedProduct);
        });

    },

    init: function () {
        this.fetchData();
    }
};

$(function () {
    Cart.init();
});
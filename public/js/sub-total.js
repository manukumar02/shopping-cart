// https://codepen.io/gabrieleromanato/pen/CqIdh

var Cart = {

    $cart: $("#cart"),
    $qtyFields: $("input.qty"),
    $triggerBtn: $("#calc"),
    $subTotalEl: $("#subtotal"),

    calculate: function () {
        var total = 0;
        this.$qtyFields.each(function () {
            var $field = $(this);
            var amount = $field.parent().next().text();
            var amountR = amount.replace(/\s+/g, "").replace(/USD/, "");
            var n1 = Number($field.val());
            var n2 = Number(amountR);

            var sum = n1 * n2;
            total += sum;

        });
        var totalStr = total.toFixed(2);
        var tot = totalStr + " USD";
        return tot;
    },
    trigger: function () {
        var self = this;
        this.$triggerBtn.on("click", function (e) {
            e.preventDefault();
            var subtotal = self.calculate();
            self.$subTotalEl.text(subtotal);
        });
    },

    init: function () {
        this.trigger();
        this.$triggerBtn.trigger("click");
        this.$cart.submit(function (e) {
            e.preventDefault();
        });
    }
};

$(function () {

    Cart.init();
});
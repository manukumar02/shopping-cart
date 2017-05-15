var Cart = {
	saCart: {
		numberOfItems: 0,
		fetchedData: '',
		selectedProduct: '',
		selectedSize: '',
		selectQuantity: '',
		selectedProductRm: '',
		removedPrdId: []
	},

	fetchData: function(prodId) {
		var self = this,
			template = '',
			temp = '',
			selectedProduct = 0,
			fetchedTempData = '',
			removedPrdId = [],
			$mainContainer = $('.container'),
			url = 'http://api.myjson.com/bins/19ynm&callback=callbackFN';

		if (Cart.saCart.removedPrdId.indexOf(prodId) < 0 && typeof prodId !== 'undefined') {
			Cart.saCart.removedPrdId.push(prodId);
			Cart.saCart.removedPrdId.sort();
		};

		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data) {
				console.log(data);
				Cart.saCart.fetchedData = data;
				$.each(Cart.saCart.fetchedData.productsInCart, function(idx, val) {
					if (val.hasOwnProperty('p_price')) {
						val.p_originalprice = val.p_originalprice.toFixed(2);
						val.p_price = val.p_price.toFixed(2) * val.p_quantity;
					}
				});

				if (typeof prodId !== 'undefined') {
					for (var i = 0; i < Cart.saCart.fetchedData.productsInCart.length; i++) {
						for (var j = 0; j < Cart.saCart.removedPrdId.length; j++) {
							if (Cart.saCart.fetchedData.productsInCart[i].p_id === Cart.saCart.removedPrdId[j].toString()) {
								Cart.saCart.fetchedData.productsInCart.splice(i, 1);
							}
						}
					}
				}

				self.getHandlebarTemplate('cart-home-page.hbs', $mainContainer, Cart.saCart.fetchedData, true);
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	overlay: function(selectedProduct) {
		var self = this,
			modal = $('#myModal'),
			btn = $('.edit'),
			overlay = $('.overlay');

		$.ajax({
			url: 'http://api.myjson.com/bins/19ynm&callback=callbackFN',
			success: function(result) {
				$.each(result.productsInCart, function(idx, val) {
					if (Number(result.productsInCart[idx].p_id) === selectedProduct) {
						Cart.saCart.fetchedData = result.productsInCart[idx];
					}
				});
				self.getHandlebarTemplate('overlay.hbs', overlay, Cart.saCart.fetchedData, false);
			}
		});

		overlay.removeClass('hidden');


	},
	removeProduct: function(rmItem) {
		var self = this;
		self.fetchData(rmItem);
		$('#' + rmItem).remove();

	},

	modifiedPopupData: function(size, qty) {
		var overlay = $('.overlay'),
			qtyPlaceholder = $('.prd-quantity'),
			sizePlaceholder = $('.m-size-value');

		qtyPlaceholder.text(qty);
		sizePlaceholder.text(size)	

		if (!overlay.hasClass('.hidden')) {
			overlay.addClass('hidden');
		}
		console.log('Modified on Edit', size, qty);
	},

	calculate: function(data) {
		var self = this,
			total = 0,
			estTotal = 0;
		//Cart.saCart.numberOfItems = 0;

		$.each(data.productsInCart, function(idx, val) {
			if (val.hasOwnProperty('p_price')) {
				total += Number(val.p_price);
			}
		});

		Cart.saCart.numberOfItems = data.productsInCart.length;
		self.disCountLogic(Cart.saCart.numberOfItems, total);

		$('.sub-amount').html('<sup>$</sup>' + total.toFixed(2));
		estTotal = total - ((total / 100) * self.disCountLogic(Cart.saCart.numberOfItems, total));
		$('.promo-code-amount').html('-<sup>$</sup>' + self.disCountLogic(Cart.saCart.numberOfItems, total));
		$('.estimated-total').html('<sup>$</sup>' + estTotal.toFixed(2));
	},

	disCountLogic: function(items, total) {
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

	getHandlebarTemplate: function(path, target, data, isCalReq) {
		var self = this,
			source,
			template;

		$.ajax({
			url: path,
			success: function(res) {
				source = res;
				template = Handlebars.compile(source);
				target.html(template(data));
				setTimeout(function() {
					self.registerEventHandler();
					if (isCalReq) {
						self.calculate(data);
					}
				}, 200);
			}
		});
	},

	registerEventHandler: function() {
		var self = this;
		$(document).find('.remove').off('click').on('click', function($el) {
			Cart.saCart.selectedProductRm = Number($($el.currentTarget).attr('data-product'));
			self.removeProduct(Cart.saCart.selectedProductRm);
		});
		$(document).find('.edit').off('click').on('click', function($el) {
			Cart.saCart.selectedProduct = Number($($el.currentTarget).attr('data-product'));
			self.overlay(Cart.saCart.selectedProduct);
		});
		$(document).find('.btn-add-to-cart').off('click').on('click', function($el) {
			Cart.saCart.selectedSize = $("#overlaySize :selected").text();
			Cart.saCart.selectQuantity = Number($("#overlayQty :selected").text().substring(5));
			self.modifiedPopupData(Cart.saCart.selectedSize, Cart.saCart.selectQuantity);
		});
		$(document).find('.close').off('click').on('click', function($el) {
			$($el.currentTarget).parents().closest('.overlay').addClass('hidden');
		});

	},

	init: function() {
		this.fetchData();
	}
};

$(function() {
	Cart.init();
});
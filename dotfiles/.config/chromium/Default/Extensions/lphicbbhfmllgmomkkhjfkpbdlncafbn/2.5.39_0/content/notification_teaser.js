var NotificationTeaser = BackboneContent.View.extend({
	id: "letyshops-notification-container-teasers",
	template: Handlebars.templates.notification_teaser,
	events:{
		"click .b-teaser__favorite": "onFavoriteClick"
	},

	initialize: function (options) {
		var self = this;
		self.options = options;
	},

	delegateEvents: function () {
		return BackboneContent.View.prototype.delegateEvents.apply(this, arguments);
	},

	onFavoriteClick: function (e) {
		var $clickedElement = $(e.currentTarget);
		var id = $clickedElement.attr("store-id");
		if (!id) {
			return;
		}

		var isFavorite = $clickedElement.attr('favorite') === "true";
		$clickedElement
			.toggleClass("b-teaser__favorite--active");

		framework.extension.fireEvent(UPDATE_FAVORITE_STATUS_FROM_NOTIFICATION,
			{
				tabId: null,
				data: {
					id,
					isFavorite
				}
			}
		);

		$clickedElement.attr('favorite', !isFavorite);
	},

	render: function () {
		if (!$.contains(window.document, this.el)) {
			var self = this;

			this.$el.empty().prepend($(this.template({
				merchants: self.options.merchants
			})));

			this.$el.insertAfter(self.options.element)

			this.$el.fadeIn(100, function () {
				_.defer(function () {
					self.delegateEvents();
				});
			});
			return this;
		}
	}
});
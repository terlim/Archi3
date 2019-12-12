var NotificationAggregator = BackboneContent.View.extend({
	id: "letyshops-cashback-aggregator",
	template: Handlebars.templates.notification_aggregator,
	initialize: function (options) {
		this.options = options;
	},
	render: function () {
		this.$el.empty().append($(this.template(this.options)));

		$(this.options.element).prepend(this.$el);

		return this;
	}
});
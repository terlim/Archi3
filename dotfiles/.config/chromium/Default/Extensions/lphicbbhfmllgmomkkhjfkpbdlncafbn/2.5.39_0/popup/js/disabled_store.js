var DisabledStore = Backbone.View.extend({
	el: "#letyshops-content-container-certain-store",
	template: Handlebars.templates.disabled_store,
	events: {
		"click .letyshops-disabled-button": "toAllowedRedirect",
	},
	initialize: function (options) {
		var self = this;
		self.options = options;
	},

	delegateEvents: function () {
		return Backbone.View.prototype.delegateEvents.apply(this, arguments);
	},

	toAllowedRedirect: function (e) {
		e.preventDefault();

		const self = this;
		self.options.app.sendGoogleAnalyticsEvent('No Extension', 'Click On Letyshops', self.options.shop_id);

		framework.browser.navigate({
			tabId: framework.browser.NEWTAB,
			url: self.options.url
		});
	},

	render: function (data) {
		var self = this;

		self.$el.parents().find("#letyshops-content-container").css("left", "-2347px");

		self.$el.empty().html(self.template(data));

		return self;
	}
});

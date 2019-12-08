var NotificationSilimarOnboarding = BackboneContent.View.extend({
	id: "letyshops-notification-container-similar-onboarding",
	template: Handlebars.templates.notification_similar_onboarding,
	events: {
		"click .letyshops__sonboarding-close": "close",
		"click .letyshops__sonboarding-thx": "thx",
	},

	initialize: function (options) {
		var self = this;
		self.options = options;
	},

	delegateEvents: function () {
		return BackboneContent.View.prototype.delegateEvents.apply(this, arguments);
	},
	thx() {
		this.$el.fadeOut(300);

		framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
			{
				tabId: null,
				data: {
					type: 'event',
					category: 'Recommendation Sort',
					action: 'Click On Thanks',
					label: this.options.model.productID,
					value: location.origin
				}
			}
		);
	},
	close() {
		this.$el.fadeOut(300);

		framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
			{
				tabId: null,
				data: {
					type: 'event',
					category: 'Recommendation Onboarding',
					action: 'Click On Close',
					label: this.options.model.productID,
					value: location.origin
				}
			}
		);
	},
	render: function () {
		if (!$.contains(window.document, this.el)) {
			const self = this;
			const renderOptions = self.model;

			this.$el.empty().append($(this.template(renderOptions)));

			var styles = {
				"position": "fixed",
				"z-index": "2147483646",
				"top": "0",
				"left": "0",
				"right": "0",
				"bottom": "0",
				"border": "0",
				"padding": "0",
				"display": "none",
			};

			this.$el.appendTo(window.document.body).css(styles);

			this.$el.fadeIn(1000, function () {
				_.defer(function () {
					self.delegateEvents();
				});
			});

			return this;
		}
	},
});
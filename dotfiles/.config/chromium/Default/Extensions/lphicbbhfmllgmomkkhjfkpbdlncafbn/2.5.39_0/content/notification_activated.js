var NotificationActivated = BackboneContent.View.extend({
    id: "letyshops-notification-activated-container",
    template: Handlebars.templates.notification_activated,
    events: {
        "click #letyshops-notification-close": "dismiss",
        "click #letyshops-notification-heart": "onFavoriteClick"
    },

    initialize: function (options) {
        var self = this;
        self.options = options;
        framework.extension.attachEvent(UPDATE_FAVORITE_STATUS_FROM_BG, function (firedData) {
            if (firedData.data && firedData.data.id) {
                var id = firedData.data.id;
                var isFavorite = firedData.data.isFavorite;
                var validNotification = $("i[store-id='" + id + "']");
                if (validNotification) {
                    var isFavoriteHere = validNotification.attr('favorite') === "true";
                    if (isFavorite === isFavoriteHere) {
                        validNotification.toggleClass("red-heart grey-heart");
                        validNotification.attr("favorite", isFavorite ? "false" : "true");
                        validNotification.text(isFavorite ? "favorite_border" : "favorite");
                    }
                }
            }
        });
    },

    dismiss: _.throttle(function () {
        var self = this;
        framework.extension.fireEvent(NOTIFICATION_DISMISS,
            {
                tabId: null,
                data: self.model.id
            },
            _.bind(function () {
                this.$el.fadeOut();
            }, self));
    }, 1000),

    delegateEvents: function () {
        return BackboneContent.View.prototype.delegateEvents.apply(this, arguments);
    },

    onFavoriteClick: function (e) {
        var self = this;
        var $clickedElement = $(e.currentTarget);
        var id = $clickedElement.attr("store-id");
        var isFavorite = $clickedElement.attr('favorite') === "true";
        $clickedElement
            .toggleClass("red-heart grey-heart")
            .attr("favorite", isFavorite ? "false" : "true")
            .text(isFavorite ? "favorite_border" : "favorite");
        framework.extension.fireEvent(UPDATE_FAVORITE_STATUS_FROM_NOTIFICATION,
            {
                tabId: null,
                data: {
                    id: id,
                    isFavorite: isFavorite
                }
            }
        );
    },

    render: function (merchant) {
        var self = this;
        if (!$.contains(window.document, this.el)) {
            this.$el.empty().append($(this.template(merchant || self.model)));

            var styles;
            if($('#letyshops-notify-price-container').length){
                styles = {
                    "position": "fixed",
                    "margin-top": "10px",
                    "right": "10px",
                    "border": "0",
                    "padding": "0",
                    "display": "none"
                }
            } else {
                styles = {
                    "position": "fixed",
                    "z-index": "2147483647",
                    "top": "10px",
                    "right": "10px",
                    "border": "0",
                    "padding": "0",
                    "display": "none"
                }
            }

            this.$el.appendTo($('#letyshops-notify-price-container').length ? $('#letyshops-notify-price-container') : window.document.body).css(styles);



            framework.extension.fireEvent(NOTIFICATION_DISMISS, {
                tabId: null,
                data: self.model.id
            });

            self.$el.fadeIn(1000, function () {
                _.defer(function () {
                    self.delegateEvents();
                });
            });

            _.delay(_.bind(function () {
                self.$el.fadeOut();
            }, self), 5000);

            return this;
        }
    },

    addRateForHotProduct: function (hotProduct) {
        $('.letyshops-notification-merchant-rebate').html('<span>' + hotProduct[Object.keys(hotProduct)].rate + '</span>%')
    }
});
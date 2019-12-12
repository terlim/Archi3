var StoreCard = Backbone.View.extend({
    el: "#letyshops-content-container-certain-store",
    template: Handlebars.templates.store_card,
    events: {
        "click #letyshops-store-heart": "onFavoriteClick",
        "click #letyshops-cashback-activate": "onActivate",
        "click #letyshops-box-btn-advice-copy": "onCopyAdvice",
        "click #letyshops-advice-fb": "onAdviceByFb",
        "click #letyshops-advice-vk": "onAdviceByVk",
        "click #letyshops-advice-ok": "onAdviceByOk",
        "click #letyshops-footer-advice-hide-soc-info": "openSocInfo",
    },

    initialize: function (options) {
        var self = this;
        self.options = options;
        framework.extension.attachEvent(RETURN_ADVICE_LINK, function (data) {
            self.adviceLinkData = data;
            $('#letyshops-box-btn-advice-link').text(data.adviceLink);
        });
    },

    /**
     *
     */
    openSocInfo: function () {
        let self = this;
        if (framework.browser.name === BROWSER_NAME_SAFARI) {
            framework.browser.navigate({
                url: ApiClient.partner(),
                tabId: framework.browser.NEWTAB
            });
            window.close();
        } else {
            window.open(ApiClient.partner());
        }

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Partner Link',
                    action: 'Click detail',
                    label: self.merchant.attributes.title
                }
            }
        );

    },

    onCopyAdvice: function (e) {
        let self = this;
        try {
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.opacity = 0;
            input.value = $('#letyshops-box-btn-advice-link').text();
            document.body.appendChild(input);
            input.select();
            document.execCommand('Copy');
            document.body.removeChild(input);
            let tooltip = self.$el.find('.copy-success-advice');
            tooltip.fadeIn();
            _.delay(function ($el) {
                $el.fadeOut();
            }, 1500, tooltip);
        } catch (e) {
        }

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Partner Link Share',
                    action: 'copy',
                    label: self.merchant.attributes.title
                }
            }
        );
    },


    /*  SHARED*/
    onAdviceByVk: function () {
        let self = this;
        self.openWindow('http://vk.com/share.php?' + $.param({
            url: $('#letyshops-box-btn-advice-link').text(),
        }));

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Partner Link Share',
                    action: 'vk',
                    label: self.merchant.attributes.title
                }
            }
        );
    },

    onAdviceByFb: function () {
        let self = this;
        const FB_APP_ID = 889046637871751;
        self.openWindow('http://www.facebook.com/dialog/share?' + $.param({
            app_id: FB_APP_ID,
            display: framework.browser.name === BROWSER_NAME_SAFARI ? 'page' : 'popup',
            href: $('#letyshops-box-btn-advice-link').text(),
        }));

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Partner Link Share',
                    action: 'fb',
                    label: self.merchant.attributes.title
                }
            }
        );
    },

    onAdviceByOk: function () {
        let self = this;
        self.openWindow('https://connect.ok.ru/dk?' + $.param({
            'st.cmd': 'OAuth2Login',
            'st.layout': 'w',
            'st.redirect': '/dk?cmd=WidgetSharePreview&amp;st.cmd=WidgetSharePreview&amp;st.shareUrl=' + encodeURIComponent(self.options.user.get('partnerUrl')),
            'st.client_id': -1
        }));

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Partner Link Share',
                    action: 'ok',
                    label: self.merchant.attributes.title
                }
            }
        );
    },

    openWindow: function (url) {
        let self = this;
        if (framework.browser.name === BROWSER_NAME_SAFARI) {
            framework.browser.navigate({
                url: url,
                tabId: framework.browser.NEWTAB
            });
            window.close();
        } else {
            window.open(url, 'LetyShops.com', 'width=' + self.width + ', height=' + self.height + ',left=' + (screen.availWidth - self.width) / 2 + ',top=' + (screen.availHeight - self.height) / 2);
        }
    },

    delegateEvents: function () {
        return Backbone.View.prototype.delegateEvents.apply(this, arguments);
    },

    onActivate: function () {
        var self = this;
        var user = self.options.user;
        framework.extension.fireEvent(CLOSE_ALL_NOTIFICATION, {tabId: framework.browser.ALLTABS, data: self.merchant});
        // user.rewriteViewed(self.merchant.id);
        self.options.app.sendGoogleAnalyticsEvent('Extension', (user && user.isLogin()) ? 'Click activate cashback' : 'Click on login', self.merchant.get('title'));
        self.options.app.trigger(CASHBACK_ACTIVATE, self.merchant.id, function () {
            window.close();
        });
    },

    onMoveTo: function () {
        var self = this;
        framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: "http://" + self.merchant.get("domain")
            }
        );
        window.close();
    },

    /**
     * CLICK ON HEART
     */

    onFavoriteClick: function (e) {
        var self = this;
        var user = self.options.user;
        var $clickedElement = $(e.currentTarget);
        if (user && user.isLogin()) {
            var id = $clickedElement.attr("store-id");
            var isFavorite = $clickedElement.attr('favorite') === "true";
            var allHeartElements = $("i[store-id='" + id + "']");
            self.trigger(POPUP_TO_UPDATE_FAVORITE_STATUS, {id: id, isFavorite: isFavorite});
            if (isFavorite) {
                self.options.app.sendGoogleAnalyticsEvent('Extension', 'Favorite reset', self.merchant.get('title'));
            } else {
                self.options.app.sendGoogleAnalyticsEvent('Extension', 'Favorite set', self.merchant.get('title'));
            }
            _.each(allHeartElements, function (element) {
                $(element).toggleClass("red grey");
                $(element).attr("favorite", isFavorite ? "false" : "true");
                $(element).text(isFavorite ? "favorite_border" : "favorite");
            });
        }
    },

    render: function (merchant) {
        var self = this;
        this.merchant = merchant;
        merchant = merchant.toJSON();
        self.$el.empty().html(self.template(
            _.extend(
                {merchant},
                {isLogin: self.options.user.isLogin(),
                showSocialNetworks: ['BY', 'RU', 'KZ'].includes(self.options.user.get('country'))}
            ))
        );
        self.$el.parents().find("#letyshops-content-container").css("left", "-2350px");
        self.$el.parent().find("#letyshops-content-container-store").css("opacity", "0.2").animate({
            opacity: 1
        }, 500, "swing", null);
        self.renderFooterState();

        if (parseFloat(($('#letyshops-content-container-certain-store').find('.letyshops-store-cashback-user').find('span').text()).replace(/\D+/g,"")) ===
            parseFloat(($('#letyshops-content-container-certain-store').find('.letyshops-store-cashback-user-default').text()).replace(/\D+/g,""))) {
            $('#letyshops-content-container-certain-store').find('.letyshops-store-cashback-user-default').hide();
        }

        return self;
    },

    renderFooterState: function () {
        let self = this;
        self.trigger(POPUP_UPDATE_FOOTER, {
            stateSpecBtn: FOOTER_LABEL
        });
    },

    /**
     *
     */
    addInfoStore: function () {
        let self = this;
        self.$el.find('.letyshops-card-footer').append('<span>' + $.i18n('tabStoreCashbackActivateInfo')+ '</span>');

        if (!!self.options.user.isLogin()) {
            $('#letyshops-footer-container').attr('style', 'margin-top: 10px;');
            $('body').attr('style', 'height: 580px!important');
            self.trigger(POPUP_UPDATE_FOOTER, {
                stateAdvice: FOOTER_ADVICE,
                isLogin: !!self.options.user.isLogin()
            });
        }

    }
});

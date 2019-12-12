var Footer = Backbone.View.extend({
    el: "#letyshops-footer-container",
    template: Handlebars.templates.footer,
    events: {
        "click #letyshops-footer-all-stores": "toAllStores",
        "click #letyshops-footer-help": "onHelp",
        "click #letyshops-footer-settings": "toSettings",
        "click #letyshops-footer-advice-create": "createAdvice",
        "click #letyshops-footer-advice-hide-box": "hideAdvice"
    },
    initialize: function () {
        var self = this;
        this.app = framework.extension.getBackgroundPage().application;
    },

    delegateEvents: function () {
        return Backbone.View.prototype.delegateEvents.apply(this, arguments);
    },

    toAllStores: function () {
        if ($('#letyshops-tab-offers').attr('class').indexOf('unselected-tab') > -1) {
            this.app.sendGoogleAnalyticsEvent('Extension', 'Click on All Shops');
            framework.browser.navigate({
                    tabId: framework.browser.NEWTAB,
                    url: ApiClient.allStoresPage()
                }
            );
        } else {
            this.app.sendGoogleAnalyticsEvent('Extension', 'Click on All Shops With Sales');
            framework.browser.navigate({
                    tabId: framework.browser.NEWTAB,
                    url: ApiClient.hotDealsPage()
                }
            );
        }
        window.close();
    },

    onHelp: async function () {
        this.app.sendGoogleAnalyticsEvent('Extension', 'Click on Help');

        const locale = await Storage.syncGet('locale');

        framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: ApiClient.helpPage(locale.split('_')[0])
            }
        );
        window.close();
    },

    toSettings: function () {
        // TODO in next release
    },

    createAdvice: function () {
        let self = this;
        if (framework.browser.name === 'Firefox') {
            browser.runtime.sendMessage({
                action: CREATE_ADVICES
            }).then(data => $('#letyshops-box-btn-advice-link').text(data.adviceLink));
        } else {
            framework.extension.fireEvent(CREATE_ADVICES, {});
        }

        $('body').removeAttr('style');
        $('.letyshops-card-body-rules').hide();
        $('.letyshops-card-body').attr('style', 'height: 80px!important;');
        $('.letyshops-card-store').attr('style', 'height: 170px!important;');
        $('#letyshops-card-footer-advice').toggleClass('letyshops-card-footer-advice-show');

        $('#letyshops-footer-advice').hide();
        $('#letyshops-footer-advice-hide').show();


        let merchant = self.app.merchants.selectById(self.app.attributes.currentMerchant);

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
            tabId: null,
            data: {
                type: 'pageview',
                page: gaPageAdvices + merchant.attributes.title + '/'
            }
        });

    },


    hideAdvice: () => {

        $('body').attr('style', 'height: 580px!important');

        $('.letyshops-card-body-rules').show();

        $('.letyshops-card-body').removeAttr('style');
        $('.letyshops-card-store').removeAttr('style');
        $('#letyshops-card-footer-advice').toggleClass('letyshops-card-footer-advice-show');

        $('#letyshops-footer-advice').show();
        $('#letyshops-footer-advice-hide').hide();
    },


    render: function (data) {
        var self = this;
        if (data) {
            self.$el.empty().html(self.template(data));
        } else {
            self.$el.empty().html(self.template({stateSpecBtn: FOOTER_ALL_STORES}));
        }
        return self;
    }

});
var NewsTab = Backbone.View.extend({
  el: "#letyshops-content-container-news",
  template: Handlebars.templates.news_tab,
  events: {
    "click .trigger-action--redirect-letyprice": "goToLetypricePage",
    "click .trigger-action--redirect-letyclub": "goToLetyclubPage",
  },

  initialize: function (options) {
    this.options = options;
    this.app = framework.extension.getBackgroundPage().application;
  },

  delegateEvents: function () {
    return Backbone.View.prototype.delegateEvents.apply(this, arguments);
  },

  goToLetyclubPage() {
    this.app.sendGoogleAnalyticsEvent('Extension', 'Click on LetyClub button');
    framework.browser.navigate({
        tabId: framework.browser.NEWTAB,
        url: 'https://club.letyshops.com/onboarding?utm_source=letyclub&utm_medium=extension&utm_campaign=blackfriday&utm_content=RU'
      }
    );
    window.close();
  },

  goToLetypricePage() {
    this.app.sendGoogleAnalyticsEvent('Extension', 'Click on LetyPrice button');
    framework.browser.navigate({
        tabId: framework.browser.NEWTAB,
        url: 'https://letyprice.letyshops.com/?utm_source=extension'
      }
    );
    window.close();
  },

  render: function (user) {
    var self = this;
    var settings = {
      autoReinitialise: true,
      showArrows: false,
      horizontalGutter: 2,
      verticalGutter: 10,
      mouseWheelSpeed: 5,
      hideFocus: true
    };

    self.$el.empty().html(this.template(
      _.extend(Object.assign({}, user.toJSON(), {permissionsSegments: PERMISSIONS_SEGMENTS_NEWS_TAB}))
    )).find(".scroll-pane").jScrollPane(settings);

    return this;
  }
});

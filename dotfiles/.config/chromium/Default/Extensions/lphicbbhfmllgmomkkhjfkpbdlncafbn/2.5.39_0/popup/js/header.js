var Header = Backbone.View.extend({
  el: "#letyshops-header-container",
  template: Handlebars.templates.header,
  events: {
    "click .letyshops-header-company": "toLetyShops",
    "click #letyshops-header-entry": "onLogin",
    "click #letyshops-header-info-notification": "toNotification",
    "click #letyshops-tab-stores": "toStores",
    "click #letyshops-tab-offers": "toOffers",
    "click #letyshops-tab-news": "toNews",
    "click #letyshops-tab-invite": "toInvitation",
    "click #letyshops-header-info-user-picture": "toUserInfo",
    "click #letyshops-header-settings": "toSettings"
  },
  initialize: function (options) {
    var self = this;
    this.options = options;
    this.app = framework.extension.getBackgroundPage().application;

    if (_.findWhere(this.app.user.get('notifications'), {status: "1"}) && !this.app.get("currentMerchant")) {
      $(function () {
        $('#letyshops-header-bell').attr('animation', 0).click();
      });
    } else {
      if (hasPermissionSegments(PERMISSIONS_SEGMENTS_NEWS_TAB.letyclub, this.app.user.get('segments')) && !this.app.get("isFirstOpenedPopup") && !this.app.get("currentMerchant")) {
        this.app.set('currentPopupTab', 'news');
      }

      if (this.app.get("currentPopupTab") && !this.app.get("currentMerchant")) {
        switch (this.app.get("currentPopupTab")) {
          case 'invite':
            $(function () {
              $('#letyshops-tab-invite').attr('animation', 0).click();
            });
            break;
          case 'news':
            $(function () {
              $('#letyshops-tab-news').attr('animation', 0).click();
            });
            break;
          case 'offers':
            $(function () {
              $('#letyshops-tab-offers').attr('animation', 0).click();
              self.trigger(POPUP_UPDATE_FOOTER, {
                stateSpecBtn: FOOTER_ALL_OFFERS
              });
            });
            break;
          case 'notifications' :
            $(function () {
              $('#letyshops-header-bell').attr('animation', 0).click();
            });
            break;
          default:
            break;
        }
      }
    }

    this.app.set('isFirstOpenedPopup', true);
  },

  delegateEvents: function () {
    return Backbone.View.prototype.delegateEvents.apply(this, arguments);
  },

  toLetyShops: function () {
    framework.browser.navigate({
        tabId: framework.browser.NEWTAB,
        url: ApiClient.getRoot() + '?utm_source=extension&utm_campaign=popup_logo&utm_term=' + framework.browser.name.toLowerCase()
      }
    );
    window.close();
  },

  onLogin: function () {
    this.app.sendGoogleAnalyticsEvent('Extension', 'Click on login', 'Header');
    var browser = framework.browser.name.toLowerCase();
    framework.browser.navigate({
        tabId: framework.browser.NEWTAB,
        url: $('.letyshops-card-main-btn').length > 0 ? ApiClient.getRoot() + popup.storeCard.merchant.get('url') + '?auth=1&utm_source=extension&utm_campaign=popup_login&utm_term=' + browser : ApiClient.interstitialPageLogIn()
      }
    );
    window.close();
  },

  toUserInfo: function () {
    this.app.sendGoogleAnalyticsEvent('Extension', 'Click on avatar');
    framework.browser.navigate({
        tabId: framework.browser.NEWTAB,
        url: ApiClient.accountPage()
      }
    );
    window.close();
  },

  toStores: function (e) {
    var self = this;
    self.app.set('currentPopupTab', 'stores');
    var $clickedElement = $(e.currentTarget);
    if ($clickedElement.hasClass("unselected-tab")) {
      self.changeFooterContent(1);
      var animType = this.$el.find("#letyshops-header-info-notification").hasClass("selected-tab") || !this.$el.parent().find(".letyshops-tab").hasClass("selected-tab");
      this.$el.find(".selected-tab").removeClass("selected-tab").addClass("unselected-tab").find(".letyshops-tab-line").css("visibility", "hidden");
      $clickedElement.toggleClass("selected-tab unselected-tab").find(".letyshops-tab-line").css("visibility", "visible");
      this.$el.find(".letyshops-header")
        .removeClass("letyshops-gradient-scheme-red")
        .removeClass("letyshops-gradient-scheme-lilac")
        .removeClass("letyshops-gradient-scheme-green")
        .removeClass("letyshops-gradient-scheme-dark-grey")
        .css("background", "#2FBEFF")
        .animate({}, 700, "swing", function () {
          $(this).addClass("letyshops-gradient-scheme-blue").css("background", "");
        });
      if (!animType) {
        this.$el.parent().find("#letyshops-content-container").animate({
          left: 0
        }, 300, "swing", null);
      } else {
        this.$el.parent().find("#letyshops-content-container").css({"opacity": "0.2", "left": "0px"}).animate({
          opacity: 1
        }, 500, "swing", null)
      }
    }
    self.app.sendGoogleAnalyticsPageView(gaPageNews);
  },

  toOffers: function (e) {
    var self = this;
    self.app.set('currentPopupTab', 'offers');
    var $clickedElement = $(e.currentTarget);
    if ($clickedElement.hasClass("unselected-tab")) {
      self.changeFooterContent(2);
      var animType = this.$el.find("#letyshops-header-info-notification").hasClass("selected-tab") || !this.$el.parent().find(".letyshops-tab").hasClass("selected-tab");
      this.$el.find(".selected-tab").removeClass("selected-tab").addClass("unselected-tab").find(".letyshops-tab-line").css("visibility", "hidden");
      $clickedElement.toggleClass("selected-tab unselected-tab").find(".letyshops-tab-line").css("visibility", "visible");
      this.$el.find(".letyshops-header")
        .removeClass("letyshops-gradient-scheme-blue")
        .removeClass("letyshops-gradient-scheme-lilac")
        .removeClass("letyshops-gradient-scheme-green")
        .removeClass("letyshops-gradient-scheme-dark-grey")
        .css("background", "#f76149")
        .animate({}, 700, "swing", function () {
          $(this).addClass("letyshops-gradient-scheme-red").css("background", "");
        });
      if ($clickedElement.attr('animation') === 0) {
        $clickedElement.removeAttr('animation');
        this.$el.parent().find("#letyshops-content-container").css('left', '-470px');
      } else if (!animType) {
        this.$el.parent().find("#letyshops-content-container").animate({
          left: -470
        }, 300, "swing", null)
      } else {
        this.$el.parent().find("#letyshops-content-container").css({
          "opacity": "0.2",
          "left": "-470px"
        }).animate({
          opacity: 1
        }, 500, "swing", null)
      }
    }
    self.app.sendGoogleAnalyticsPageView(gaPageSales);
  },

  toNews: function (e) {
    var self = this;
    self.app.set('currentPopupTab', 'news');
    var $clickedElement = $(e.currentTarget);

    if ($clickedElement.hasClass("unselected-tab")) {
      self.changeFooterContent(3);
      var animType = this.$el.find("#letyshops-header-info-notification").hasClass("selected-tab") || !this.$el.parent().find(".letyshops-tab").hasClass("selected-tab");
      this.$el.find(".selected-tab").removeClass("selected-tab").addClass("unselected-tab").find(".letyshops-tab-line").css("visibility", "hidden");
      $clickedElement.toggleClass("selected-tab unselected-tab").find(".letyshops-tab-line").css("visibility", "visible");
      this.$el.find(".letyshops-header")
        .removeClass("letyshops-gradient-scheme-blue")
        .removeClass("letyshops-gradient-scheme-lilac")
        .removeClass("letyshops-gradient-scheme-green")
        .removeClass("letyshops-gradient-scheme-dark-grey")
        .css("background", "#121212")
        .animate({}, 700, "swing", function () {
          $(this).addClass("letyshops-gradient-scheme-dark-grey").css("background", "");
        });
      if ($clickedElement.attr('animation') === 0) {
        $clickedElement.removeAttr('animation');
        this.$el.parent().find("#letyshops-content-container").css('left', '-1880px');
      } else if (!animType) {
        this.$el.parent().find("#letyshops-content-container").animate({
          left: -1880
        }, 300, "swing", null)
      } else {
        this.$el.parent().find("#letyshops-content-container").css({
          "opacity": "0.2",
          "left": "-1880px"
        }).animate({
          opacity: 1
        }, 500, "swing", null)
      }
    }
  },

  toInvitation: function (e) {
    var self = this;
    self.app.set('currentPopupTab', 'invite');
    var $clickedElement = $(e.currentTarget);
    if ($clickedElement.hasClass("unselected-tab")) {
      self.trigger(POPUP_TO_INVITATION_TAB);
      self.changeFooterContent(3);
      var animType = this.$el.find("#letyshops-header-info-notification").hasClass("selected-tab") || !this.$el.parent().find(".letyshops-tab").hasClass("selected-tab");
      this.$el.find(".selected-tab").removeClass("selected-tab").addClass("unselected-tab").find(".letyshops-tab-line").css("visibility", "hidden");
      $clickedElement.toggleClass("selected-tab unselected-tab").find(".letyshops-tab-line").css("visibility", "visible");
      this.$el.find(".letyshops-header")
        .removeClass("letyshops-gradient-scheme-blue")
        .removeClass("letyshops-gradient-scheme-lilac")
        .removeClass("letyshops-gradient-scheme-red")
        .removeClass("letyshops-gradient-scheme-dark-grey")
        .css("background", "#f76149")
        .animate({}, 700, "swing", function () {
          $(this).addClass("letyshops-gradient-scheme-green").css("background", "");
        });
      if ($clickedElement.attr('animation') === 0) {
        $clickedElement.removeAttr('animation');
        this.$el.parent().find("#letyshops-content-container").css('left', '-940px');
      } else if (!animType) {
        this.$el.parent().find("#letyshops-content-container").animate({
          left: -940
        }, 300, "swing", null)
      } else {
        this.$el.parent().find("#letyshops-content-container").css({
          "opacity": "0.2",
          "left": "-940px"
        }).animate({
          opacity: 1
        }, 500, "swing", null)
      }
    }
    self.app.sendGoogleAnalyticsPageView(gaPageFriends);
  },

  toNotification: function (e) {
    var self = this;
    self.trigger(POPUP_TO_NOTIFICATION_TAB);
    self.app.set('currentPopupTab', 'notifications');
    self.$el.find("#letyshops-header-bell").empty().text("notifications_none");
    var $clickedElement = $(e.currentTarget);
    if ($clickedElement.hasClass("unselected-tab")) {
      self.changeFooterContent(4);
      this.$el.find(".selected-tab").removeClass("selected-tab").addClass("unselected-tab").find(".letyshops-tab-line").css("visibility", "hidden");
      $clickedElement.toggleClass("selected-tab unselected-tab");
      this.$el.find(".letyshops-header")
        .removeClass("letyshops-gradient-scheme-blue")
        .removeClass("letyshops-gradient-scheme-red")
        .removeClass("letyshops-gradient-scheme-green")
        .removeClass("letyshops-gradient-scheme-dark-grey")
        .css("background", "#7986cb")
        .animate({}, 700, "swing", function () {
          $(this).addClass("letyshops-gradient-scheme-lilac").css("background", "");
        });
      this.$el.parent().find("#letyshops-content-container").css("left", "-1410px");
      this.$el.parent().find("#letyshops-content-container-notification").css("opacity", "0.2").animate({
        opacity: 1
      }, 500, "swing", null)
    }
    self.app.sendGoogleAnalyticsPageView(gaPageHistory);
  },

  changeFooterContent: function (tabId) {
    var self = this;
    var toDetect = !self.$el
        .find("#letyshops-header-info-notification")
        .hasClass("selected-tab") &&
      !self.$el
        .find("#letyshops-tab-invite")
        .hasClass("selected-tab") &&
      self.$el
        .find(".selected-tab").length;

    if (toDetect)
      var previousState = self.detectFooterContent();
    if (tabId === 1) {
      self.trigger(POPUP_UPDATE_FOOTER, {
        stateSpecBtn: self.previousStoreTabState
      });
      if (toDetect)
        self.previousOfferTabState = previousState;
    } else if (tabId === 2) {
      self.trigger(POPUP_UPDATE_FOOTER, {
        stateSpecBtn: self.previousOfferTabState
      });
      if (toDetect)
        self.previousStoreTabState = previousState;
    } else if (tabId === 3 || tabId === 4) {
      self.trigger(POPUP_UPDATE_FOOTER, {
        stateSpecBtn: FOOTER_LABEL
      });
      if (toDetect) {
        if (self.$el.find("#letyshops-tab-stores").hasClass("selected-tab"))
          self.previousStoreTabState = previousState;
        else
          self.previousOfferTabState = previousState;
      }
    }
  },

  toAppropriateOfferState: function (data) {
    var self = this;
    if (data.tab == "stores")
      self.previousStoreTabState = data.stateSpecBtn;
    else if (data.tab == "offers")
      self.previousOfferTabState = data.stateSpecBtn;
  },

  detectFooterContent: function () {
    var self = this;
    var navigateElement = self.$el.parent().find("#letyshops-footer-all-stores");
    if (navigateElement) {
      return $(navigateElement).attr("state");
    } else {
      return FOOTER_LABEL;
    }
  },

  switchOffTabs: function (forceSaveFooterState) {
    var self = this;
    if (forceSaveFooterState == true) self.previousStoreTabState = self.detectFooterContent();
    self.$el.find(".letyshops-tab").removeClass("selected-tab").addClass("unselected-tab");
    self.$el.find(".letyshops-tab-line").css("visibility", "hidden");
  },

  toSettings: function () {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  },

  render: function (user) {
    this.$el.empty().html(this.template(
      _.extend(Object.assign({}, user.toJSON(), {permissionsSegments: PERMISSIONS_SEGMENTS_NEWS_TAB}))
    ));

    if (!this.app.get('currentMerchant')) {
      switch (this.app.get('currentPopupTab')) {
        case "invite" :
          $('.letyshops-header').addClass('letyshops-gradient-scheme-green');
          break;
        case "stores" :
          $('.letyshops-header').addClass('letyshops-gradient-scheme-blue');
          break;
        case "news" :
          $('.letyshops-header').addClass('letyshops-gradient-scheme-dark');
          break;
        case "offers" :
          $('.letyshops-header').addClass('letyshops-gradient-scheme-red');
          break;
        case "notifications" :
          $('.letyshops-header').addClass('letyshops-gradient-scheme-lilac');
          break;
        default:
          $('.letyshops-header').addClass('letyshops-gradient-scheme-blue');
          break;
      }
    }
    return this;
  }
});

let ApiClient = (function () {
    let self = {};

    self.domain = 'letyshops.com';
    self._root = 'https://' + self.domain;
    self._help = 'https://help.' + self.domain;
    self._api = 'https://eapi.' + self.domain + '/eapi';
    self._price = 'https://price.' + self.domain;
    self.cookieKey = 'uid';

    /**
     *
     */
    self.updateUrlsApi = () => {
        if (typeof framework !== "undefined") {
            if (Object.keys(framework).length > 2) {
                $.ajax({
                    url: self._api + '/urls',
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data && data.siteUrl) {
                                self.domain = new URL(data.siteUrl).hostname;
                                self._root = data.siteUrl;
                                self._link = data.siteUrl;
                            }
                            if (data && data.apiUrl) {
                                self._api = data.apiUrl + '/eapi';
                            }
                            if (data && data.apiUrl && data.cdnUrl) {
                                self._cdn = data.cdnUrl + '/eapi';
                            }
                            Storage.set('dataUrls', data);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(textStatus + ':' + errorThrown);
                    }
                });

                clearInterval(self.intervalupdateUrlsApiHandlerTimer);
                self.intervalupdateUrlsApiHandlerTimer = setInterval(function () {
                    self.updateUrlsApi();
                }, UPDATE_INTERVAL_URLS);

            } else {
                Storage.get('dataUrls', function (data) {
                    if (data) {
                        if (data && data.siteUrl) {
                            self.domain = new URL(data.siteUrl).hostname;
                            self._root = data.siteUrl;
                            self._link = data.siteUrl;
                        }
                        if (data && data.apiUrl) {
                            self._api = data.apiUrl + '/eapi';
                        }
                        if (data && data.apiUrl && data.siteUrl && data.cdnUrl) {
                            self._cdn = data.cdnUrl + '/eapi';
                        }
                    } else {
                        self.updateUrlsApi();
                    }
                });
            }
        }
    };

    /**
     * Получаем настройки
     */
    self.getSettings = () => {
        if (typeof framework !== "undefined" && Object.keys(framework).length > 2) {
            $.ajax({
                url: (self._cdn ? self._cdn : self._api) + '/settings',
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        Storage.set('settings', data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(textStatus + ':' + errorThrown);
                }
            });

            clearInterval(self.intervalupdateSettingsApiHandlerTimer);
            self.intervalupdateSettingsApiHandlerTimer = setInterval(function () {
                self.getSettings();
            }, UPDATE_INTERVAL_SETTINGS);
        }
    };

    self.updateUrlsApi();
    self.getSettings();

    /**
     *
     * @returns {string}
     */
    self.getRoot = () => {
        return self._root + '/';
    };

    /**
     *
     * @returns {string}
     */
    self.getLink = () => {
        return self._link ? self._link + '/' : self.getRoot();
    };

    /**
     *
     * @returns {string}
     */
    self.afterInstall = () => {
        let browser = Utils.getFullInfo().browser === BROWSER_NAME_YABROWSER ? 'yabrowser' : framework.browser.name.toLowerCase();
        return self._root + '/extension?action=install&utm_source=extension&utm_campaign=install&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.afterDelete = () => {
        let browser = Utils.getFullInfo().browser === BROWSER_NAME_YABROWSER ? 'yabrowser' : framework.browser.name.toLowerCase();
        return self._root + '/extension?action=uninstall&utm_source=extension&utm_campaign=uninstall&utm_term=' + browser;
    };

    /**
     * GET
     * @returns {string}
     */
    self.user = () => {
        return self._api + '/user';
    };

    /**
     * GET
     * @returns {string}
     */
    self.cashRates = () => {
        return self._api + '/cashback-rates';
    };

    /**
     * GET
     * @param id
     * @returns {string}
     */
    self.userCashbackRates = (id) => {
        return self._api + '/cashback-rates/' + id;
    };

    /**
     * GET
     * @returns {string}
     */
    self.userCodes = () => {
        return self._api + '/user/lety-codes';
    };

    /**
     * GET POST
     * @returns {string}
     */
    self.favoriteMerchants = () => {
        return self._api + '/user/shops-liked';
    };

    /**
     * POST
     * @returns {string}
     */
    self.deleteFavoriteMerchant = () => {
        return self._api + '/user/shops-disliked';
    };

    /**
     * GET
     * @returns {string}
     */
    self.merchants = () => {
        return (self._cdn ? self._cdn : self._api) + '/shops';
    };

    /**
     * GET
     * @returns {string}
     */
    self.offers = () => {
        return self._api + '/promotions';
    };

    /**
     * GET POST
     * @returns {string}
     */
    self.visitedMerchants = () => {
        return self._api + '/user/shops-viewed';
    };

    /**
     * GET
     * @returns {string}
     */
    self.recommendMerchants = () => {
        return self._api + '/user/shops-recomended';
    };

    /**
     * GET POST
     * @returns {string}
     */
    self.notifications = () => {
        return self._api + '/user/notifications';
    };

    /**
     *
     * @returns {string}
     */
    self.advices = () => {
        return self._api + '/user/advices';
    };

    /**
     *
     * @returns {string}
     */
    self.interstitialPage = () => {
        return self._root + '/';
    };

    /**
     *
     * @returns {string}
     */
    self.interstitialPageLogIn = () => {
        var browser = framework.browser.name.toLowerCase();
        return self._root + '?auth=1&utm_source=extension&utm_campaign=popup_login&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.accountPage = () => {
        var browser = framework.browser.name.toLowerCase();
        return self._root + '/user?utm_source=extension&utm_campaign=popup_user&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.allStoresPage = () => {
        var browser = framework.browser.name.toLowerCase();
        return self._root + '/shops?utm_source=extension&utm_campaign=shops&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.hotDealsPage = () => {
        var browser = framework.browser.name.toLowerCase();
        return self._root + '/hot-deals?utm_source=extension&utm_campaign=hot_deals&utm_term=' + browser;
    };

    /**
     *
     * @param language
     * @returns {string}
     */
    self.helpPage = (language) => {
        var browser = framework.browser.name.toLowerCase();
        return self._help + '/hc/' + language + '/sections/360000147845?utm_source=extension&utm_campaign=support&utm_content=zendesk&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.confidentialPage = () => {
        var browser = framework.browser.name.toLowerCase();
        return self._root + '/confidential?utm_campaign=confidential&utm_content=zendesk&utm_source=extension&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.reasonCashbackReactivate = () => {
        var browser = framework.browser.name.toLowerCase();
        return self._root + '/re-activate-cashback-message?utm_source=extension&utm_campaign=notification_re_activate_cashback&utm_term=' + browser;
    };

    /**
     *
     * @returns {string}
     */
    self.aliexpressPendingOrders = () => {
        return self._api + '/user/transactions?transaction_type=cashback&status=pending&shop_id=13366481';
    };

    /**
     * POST
     * @returns {string}
     */
    self.logRewrite = () => {
        return self._api + '/log-rewrite';
    };

    /**
     * POST
     * @returns {string}
     */
    self.logActivate = () => {
        return self._api + '/log-activate';
    };

    /**
     * POST
     * @returns {string}
     */
    self.logThanksGiving = () => {
        return self._api + '/log-thanks';
    };

    /**
     * POST
     * @returns {string}
     */
    self.logInstall = () => {
        return self._api + '/extension/install';
    };

    /**
     * POST
     * @returns {string}
     */
    self.logRequest = () => {
        return self._api + '/extension/request';
    };

    /**
     *
     * @returns {string}
     */
    self.logUserSettings = () => {
        return self._api + '/user/extension-settings';
    };

    /**
     * Get info about promo notifications
     * @returns {string}
     */
    self.promoNotifications = () => {
        return (self._cdn ? self._cdn : self._api) + '/promo-notifications';
    };

    /**
     *
     * @returns {string}
     * @constructor
     */
    self.ddList = () => {
        return (self._cdn ? self._cdn : self._api) + '/dd-list';
    };

    /**
     *
     * @returns {string}
     */
    self.partner = () => {
        return self._root + '/cashbacklink';
    };

    /**
     *
     * @returns {string}
     */
    self.cashbackIsAvailable = () => {
        return self._price + '/api/extension/v1/cashback/is-available';
    };

    /**
     *
     * @returns {string}
     */
    self.itemInfo = () => {
        return self._price + '/api/extension/v1/item/info';
    };

    /**
     *
     * @returns {string}
     */
    self.itemHistory = () => {
        return self._price + '/api/extension/v1/item/history';
    };

    /**
     *
     * @returns {string}
     */
    self.itemWishUpdate = () => {
        return self._price + '/api/extension/v1/item/wish-update';
    };

    /**
     *
     * @returns {string}
     */
    self.itemWishList = () => {
        return self._price + '/api/extension/v1/item/wish-list';
    };

    /**
     *
     * @returns {string}
     */
    self.itemHot = () => {
        return self._price + '/api/extension/v1/item/hot';
    };

    /**
     *
     * @returns {string}
     */
    self.similarList = () => {
        return self._price + '/api/extension/v1/similar/list';
    };

    /**
     *
     * @returns {string}
     */
    self.letyToolEvent = () => {
        return self._price + '/api/extension/v1/event/inform';
    };

    return self;
}());

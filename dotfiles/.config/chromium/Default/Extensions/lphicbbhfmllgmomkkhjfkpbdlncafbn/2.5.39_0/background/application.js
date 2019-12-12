var apps4cashback = Backbone.Model.extend({
    models: [
        "user",
        "merchants",
        "offers",
        "tabs"
    ],
    history: [],

    defaults: {
        "merchants": new Merchants(),
        "offers": new Offers(),
        "user": new User(),
        "tabs": new Tabs(),
        "currentMerchant": null,
        "currentPopupTab": 'stores',
        "visitedMerchants": []
    },

    initialize: function () {
        var self = this;

        self.loadUserLanguage();

        var isHotProduct = false;
        var hotProductId = null;
        var rate = null;

        //-- initialize jQuery specific options
        $.support.cors = true;
        self.initPopup();
        self.onInstalledAndDelete();
        Button.standard();

        /*option page close trick*/
        if (framework.browser.name !== BROWSER_NAME_SAFARI) {
            chrome.runtime.onConnect.addListener(async port => {
                let userSettings = await Storage.syncGet('userSettings') || {};

                if (port.name === 'optionspresence') {
                    port.onDisconnect.addListener(async () => {
                        let newUserSettings = await Storage.syncGet('userSettings') || {};

                        if (Object.keys(userSettings).length !== Object.keys(newUserSettings).length ||
                            Object.keys(userSettings).length === Object.keys(newUserSettings).length &&
                            Object.keys(userSettings).filter(key => userSettings[key] !== newUserSettings[key]).length) {
                            framework.extension.fireEvent(SEND_USER_SETTINGS, {data: {type: 1}});
                        }
                    });
                }
            });
        }

        _.extend(this, _.object(
            _.map(self.models,
                function (name) {
                    return [name, self.attributes[name]];
                }
            )
        ));

        self.merchants.listenTo(self.user, "change:viewed", function (model, value) {
            Storage.get('viewedMerchants', function (dataViewedMerchants) {
                if (dataViewedMerchants && dataViewedMerchants.length > 0) {
                    self.user.set('viewed', dataViewedMerchants);
                    self.merchants.setViewed(dataViewedMerchants);
                } else {
                    self.merchants.setViewed(value);
                }
            })

        });
        self.merchants.listenTo(self.user, "change:favorites", function (model, value) {
            self.merchants.setFavorites(value);
        });
        self.merchants.listenTo(self.user, "change:recommended", function (model, value) {
            self.merchants.setRecommended(value);
        });

        self.merchants.listenTo(self.user, "change:token", function () {
            self.user.rates.fetch(true);
        });

        self.merchants.listenTo(self.user.get("rates"), "reset", function (collection) {
            self.merchants.setPersonalCashback(collection.toJSON());
        });

        self.user.listenTo(self.merchants, "reset", function (collection) {
            if (self.user.isLogin()) {
                Storage.get('viewedMerchants', function (dataViewedMerchants) {
                    if (dataViewedMerchants && dataViewedMerchants.length > 0) {
                        self.user.set('viewed', dataViewedMerchants);
                        collection.setViewed(dataViewedMerchants);
                    } else {
                        collection.setViewed(self.user.get("viewed"));
                    }
                });
                collection.setRecommended(self.user.get("recommended"));
                collection.setFavorites(self.user.get("favorites"));
            }
        });

        self.listenTo(self.tabs, 'change:url', self.initializeInterstitialPageActivationHandler);
        self.on(CASHBACK_ACTIVATE, self.activateFromPopup); // is used in store card

        self.usersNotifyHandler();

        self.initializeNotificationHandler();
        self.initializeParamsHandler();
        self.initializeCookieHandler();
        self.initializeIconAnimation();
        self.initializeGoogleAnalyticsHandler();

        self.setSettingsFromApi();
        self.rivalAddListHandlerAjax();

        clearInterval(self.intervalPushlogRequest);
        self.intervalPushlogRequest = setInterval(function () {
            self.pushLogRequest(ApiClient.logRequest());
        }, INTERVAL_PUSH_LOG_REQUEST);

        _.delay(function () {
            Storage.get(POPUP_FIRST_OPENING_TOKEN, function (token) {
                if (!token && !self.user.isLogin()) {
                    Button.setBadge("!");
                }
            });
        }, 4000);

        setInterval(_.bind(function () {
            self.periodicPushViewedMerchant(self.get('visitedMerchants'), ApiClient.visitedMerchants());
            self.set('visitedMerchants', []);
        }, self), PERIODIC_SHOP_VIEWED);

        async function checkActivateCachback(event) {
            if (!(event.url.includes('s.click.aliexpress') || event.url.includes('affiliates.rozetka.com.ua'))) {
                var domain = Utils.getDomain(event.url);
                var merchant = self.merchants.selectByDomain(domain);

                var hotProductsUrl = new URL(event.url);
                if (!!hotProductsUrl.search.substr(1).match('hot_product_id=')) {

                    function getUrlParameter(sParam) {
                        var sPageURL = decodeURIComponent(hotProductsUrl.search.substring(1)),
                            sURLVariables = sPageURL.split('&'),
                            sParameterName,
                            i;

                        for (i = 0; i < sURLVariables.length; i++) {
                            sParameterName = sURLVariables[i].split('=');

                            if (sParameterName[0] === sParam) {
                                return sParameterName[1] === undefined ? true : sParameterName[1];
                            }
                        }
                    }

                    hotProductId = getUrlParameter('hot_product_id');
                    rate = getUrlParameter('rate');

                    isHotProduct = true;
                }
                if (!!merchant && !!merchant.attributes && isHotProduct) {
                    if (!merchant.attributes.hotProducts) {
                        merchant.attributes.hotProducts = [];
                    }
                    var damainPrice = Utils.getDomainPrice(hotProductsUrl.host);
                    var id = Utils.getProductId(damainPrice, hotProductsUrl.pathname);

                    var objHotProduct = {};
                    objHotProduct[id] = {
                        hot_product_id: hotProductId,
                        rate: rate
                    };

                    if (!!merchant.attributes.hotProducts && merchant.attributes.hotProducts.length > 0) {
                        _.each(merchant.attributes.hotProducts, function (item) {
                            if (!Object.keys(item).includes(id)) {
                                merchant.attributes.hotProducts.push(objHotProduct);
                            }
                        });
                    } else {
                        merchant.attributes.hotProducts.push(objHotProduct);
                    }

                    isHotProduct = false;
                    hotProductId = null;
                    rate = null;
                }

                if (merchant && self.user.isLogin()) {

                    if (!merchant.get("isActivated") && !merchant.get("savedParams") && !merchant.get("rewrite")) {
                        self.onParameterSave(event);
                        if (merchant.get("savedParams")) {
                            merchant.trigger(CASHBACK_ACTIVATE);
                        }
                    } else if (merchant.get("isActivated") && merchant.get("savedParams")) {
                        self.onParameterResearch(event);
                    }
                }
            }

            //feature/EX-533
            let domainRedirect = Utils.getDomain(event.url);
            let merchantRedirect = self.merchants.selectByDomain(domainRedirect);

            if (!!merchantRedirect && merchantRedirect.get("extendedTab")) {
                merchantRedirect.get("extendedTab").history.forEach(function (item) {
                    let url_string = item.url;
                    let url = new URL(url_string);
                    if (url.origin.includes('alitems.com')) {
                        if (url.searchParams.get("subid") && !merchantRedirect.get('subids') ||
                            url.searchParams.get("subid") && url.searchParams.get("subid") !== merchantRedirect.get('subids').subid) {
                            let tmp = merchantRedirect.get('subids') ? merchantRedirect.get('subids') : {};
                            tmp.subid = url.searchParams.get("subid");
                            merchantRedirect.set('subids', tmp);
                        }
                        if (url.searchParams.get("subid2") && !merchantRedirect.get('subids') ||
                            url.searchParams.get("subid2") && url.searchParams.get("subid2") !== merchantRedirect.get('subids').subid2) {
                            let tmp = merchantRedirect.get('subids') ? merchantRedirect.get('subids') : {};
                            tmp.subid2 = url.searchParams.get("subid2");
                            merchantRedirect.set('subids', tmp);
                        }
                    }
                });
            }

            if (!(event.url.includes('s.click.aliexpress')) && event.url.includes('aliexpress.com') &&
                merchantRedirect && merchantRedirect.get("isActivated")) {

                let damainPriceRedirect, idRedirect;
                try {
                    damainPriceRedirect = Utils.getDomainPrice(new URL(event.url).host);
                    idRedirect = parseInt(Utils.getProductId(damainPriceRedirect, new URL(event.url).pathname), 10)
                } catch (e) {
                }

                if (!!idRedirect && (!merchantRedirect.get('hot') ||
                    merchantRedirect.get('hot') && !merchantRedirect.get('hot')['hot_' + idRedirect])) {
                    let hotInfo = self.getHotInfo(event.url, self.user);
                    if (!hotInfo.hot) {
                        hotInfo.hot = false;
                    }
                    merchantRedirect.attributes.hot = {
                        ["hot_" + idRedirect]: hotInfo.hot
                    };
                }

                if (merchantRedirect.get('hot') && merchantRedirect.get('hot')['hot_' + idRedirect] &&
                    !merchantRedirect.get('hot')['hot_' + idRedirect].isActivatedHotProduct) {

                    let isHotProductRedirect = false;

                    let history = self.tabs.selectById(self.tabs.currentTabId).get('history')
                        ? self.tabs.selectById(self.tabs.currentTabId).get('history')
                        : merchantRedirect.get('extendedTab').history;

                    history.forEach(function (item) {
                        let url_string = item.url;
                        let url = new URL(url_string);
                        if (url.origin.includes('letyshops.com')) {
                            if (url.searchParams.get("hot_product_id") && url.searchParams.get("rate")) {
                                isHotProductRedirect = true;
                            }
                        }
                    });

                    if (!isHotProductRedirect) {
                        merchantRedirect.unset("isActivated");
                        merchantRedirect.unset("savedParams");
                        merchantRedirect.unset("savedCookie");

                        let hot = merchantRedirect.get('hot')['hot_' + idRedirect];
                        hot.isActivatedHotProduct = true;
                        merchantRedirect.unset('hot');
                        merchantRedirect.attributes.hot = {
                            ["hot_" + idRedirect]: hot
                        };

                        await framework.browser.navigate({
                                tabId: framework.browser.CURRENTTAB,
                                url: merchantRedirect.attributes.hot['hot_' + idRedirect].url + "&subid="
                                    + merchantRedirect.attributes.subids.subid + "&subid2="
                                    + merchantRedirect.attributes.subids.subid2 + "&subid3=ex53"
                                    + merchantRedirect.attributes.hot['hot_' + idRedirect].commissionCategory
                            }
                        );
                    }
                }
            }
            // end feature/EX-533
        }

        if (framework.browser.name === BROWSER_NAME_SAFARI) {
            safari.application.addEventListener("beforeNavigate", function (event) {
                checkActivateCachback(event);
            }, false);
            // hack for firefox EX-418 && EX-436
        } else {
            chrome.webRequest.onBeforeSendHeaders.addListener(function (event) {
                checkActivateCachback(event);
            }, {urls: ["<all_urls>"], types: ["main_frame", 'xmlhttprequest']});
        }
    },

    /**
     *
     * @returns {Promise<void>}
     */
    loadUserLanguage: async function (language) {
        const self = this;

        const user = self.get('user');
        const cacheLanguage = await Storage.syncGet('locale') || '';
        const lang = (navigator.language).split('-')[0];
        const locale = language || cacheLanguage.split('_')[0] || user.get('language') || lang || DEFAULT_LANGUAGE;

        $.i18n({locale});

        let i18nData;
        try {
            i18nData = await fetch('./libs/i18n/' + $.i18n().locale + '.json', {mode: 'same-origin'})
                .then((response) => response.json());
        } catch (e) {
            i18nData = await fetch('./libs/i18n/' + DEFAULT_LANGUAGE + '.json', {mode: 'same-origin'})
                .then((response) => response.json());
        }

        const languageStorage = {
            [locale]: i18nData
        };

        $.i18n().load(languageStorage);

        Button.setTitle($.i18n('title'));

        Storage.set('i18nDataLocale', languageStorage);

        self.i18n = {locale};
    },

    /**
     *
     */
    setSettingsFromApi: function () {
        var self = this;
        Storage.get('settings', function (data) {
            if (data) {
                if (data.updateIntervals) {
                    _.each(Object.keys(data.updateIntervals), function (item, index) {
                        switch (item) {
                            case 'shops':
                                UPDATE_INTERVAL_MERCHANT = Object.values(data.updateIntervals)[index];
                                break;
                            case 'promotions':
                                UPDATE_INTERVAL_OFFERS = Object.values(data.updateIntervals)[index];
                                break;
                            case 'lety-codes':
                                UPDATE_INTERVAL_CODES = Object.values(data.updateIntervals)[index];
                                break;
                            case 'settings':
                                UPDATE_INTERVAL_SETTINGS = Object.values(data.updateIntervals)[index];
                                break;
                            case 'urls':
                                UPDATE_INTERVAL_URLS = Object.values(data.updateIntervals)[index];
                                break;
                            case 'promo-notifications':
                                PROMO_NOTIFY_PERIOD = Object.values(data.updateIntervals)[index];
                                break;
                            case 'dd-list':
                                R_LIST_ADD_PERIOD = Object.values(data.updateIntervals)[index];
                                break;
                            case 'user_notifications':
                                USER_NOTIFY_INTERVAL = Object.values(data.updateIntervals)[index];
                                break;
                            case 'user_cashback_rates':
                                INTERVAL_COUNT_USER_CASHBACK_RATES = Object.values(data.updateIntervals)[index];
                                break;
                        }
                    })
                }

                if (data.autoUpdate.shops) {
                    self.user.rates.fetch(true);
                }

                if (data.regExr && Object.keys(data.regExr).length > 0) {
                    _.each(data.regExr, function (item) {
                        _.each(Object.keys(item), function (param, index) {
                            switch (param) {
                                case 'CheckElementAli':
                                    CHECK_ELEMENT_ALI = Object.values(item)[index];
                                    break;
                                case 'RegExIDProductAli':
                                    REGEX_ALI_PRODUCT_ID = Object.values(item)[index];
                                    break;
                                case 'RegExActMinPriceAli':
                                    REGEX_ACT_MIN_PRICE = Object.values(item)[index];
                                    break;
                                case 'RegExMinPriceAli':
                                    REGEX_MIN_PRICE = Object.values(item)[index];
                                    break;
                                case 'RegExActMaxPriceAli':
                                    REGEX_ACT_MAX_PRICE = Object.values(item)[index];
                                    break;
                                case 'RegExMaxPriceAli':
                                    REGEX_MAX_PRICE = Object.values(item)[index];
                                    break;
                                case 'RegExBaseCurrencyCodeAli':
                                    REGEX_BASE_CURRENCY_CODE = Object.values(item)[index];
                                    break;
                                case 'CheckElementPriceGb':
                                    CHECK_ELEMENT_GEARBEST = Object.values(item)[index];
                                    break;
                                case 'RegExIDProductGb':
                                    REGEX_GEARBEST_PRODUCT_ID = Object.values(item)[index];
                                    break;
                            }
                        });
                    })
                }

                if (data.regExrDomain && Object.keys(data.regExrDomain).length > 0) {
                    _.each(Object.keys(data.regExrDomain), function (item, index) {
                        switch (item) {
                            case 'check_letyshops':
                                CHECK_LETYSHOPS = Object.values(data.regExrDomain)[index];
                                break;
                            case 'check_letyshops_view':
                                CHECK_LETYSHOPS_VIEW = Object.values(data.regExrDomain)[index];
                                break;
                            case 'lety-check_letyshops_view_id':
                                CHECK_LETYSHOPS_VIEW_ID = Object.values(data.regExrDomain)[index];
                                break;
                        }
                    })
                }
            }
        });

        setTimeout(function () {
            self.usersNotifyHandler();
        }, 15 * 60 * 1000);
    },


    /**
     * GET OFFERS TOGETHER WITH MERCHANT INFO
     * @returns {*}
     */
    getPreparedOffers: function () {
        var self = this;
        var topOffer = self.offers.getTopOffer();
        var offers = self.offers.getNoTopOffers(topOffer.id);
        offers = self.merchants.checkOfferMerchant(offers);
        if ((topOffer && (topOffer.length > 0 || Object.keys(topOffer).length > 0)) || (offers && offers.length > 0)) {
            return _.object(
                [
                    "specialOffer",
                    "offers"
                ],
                [
                    _.extend(
                        topOffer.toJSON(),
                        self.merchants.getInfoForOffer(topOffer.get("shopId"))),
                    _.map(
                        offers,
                        function (offer, index, arr) {
                            return _.extend(
                                offer.toJSON(),
                                self.merchants.getInfoForOffer(offer.get("shopId"))
                            )
                        }
                    )
                ]
            )
        } else {
            return null;
        }
    },

    /**
     * WHEN ACTIVATE FROM POPUP
     * @param merchantId
     * @param callback
     */
    activateFromPopup: function (merchantId, callback) {
        var self = this;
        var browser = framework.browser.name.toLowerCase();
        var merchant = self.merchants.selectById(merchantId);
        if (merchant) {
            var tab = self.tabs.selectById();
            let activateUrl = merchant.get("activateUrl");

            if (tab && (new RegExp(merchant.get("pattern")).test(tab.get("domain")))) {
                var parameterDeepLink = tab.get("url") ? encodeURIComponent(tab.get("url")) : '';
                framework.browser.navigate({
                        tabId: tab.id,
                        url: ApiClient.getLink() + activateUrl + PARAMETER_DEEP_LINK + parameterDeepLink + '&utm_source=extension&utm_campaign=partner_info&utm_term=' + browser
                    }
                );
            } else {
                var utmParams = merchant.get('url').split('/');
                framework.browser.navigate({
                        tabId: framework.browser.NEWTAB,
                        url: ApiClient.getLink() + activateUrl + '?utm_source=extension&utm_campaign=' + utmParams[0] + '&utm_content=' + utmParams[1] + '&utm_term=' + browser
                    }
                );
            }
            callback && callback();
        }
    },

    /**
     * MAIN HANDLERS
     */
    initializeNotificationHandler: function () {
        var self = this;
        framework.extension.attachEvent(NOTIFICATION_DISMISS, function (event, callback) {
            if (event.data) {
                var merchant = self.merchants.selectById(event.data);
                merchant && merchant.trigger(MERCHANT_SUPPRESSED);
                callback && callback();
            }
        });
        framework.extension.attachEvent(NOTIFICATION_CASHBACK_ACTIVATE, function (event, callback) {
            if (event.data) {
                var merchant;
                if (event.data && event.data.merchantId) {
                    merchant = self.merchants.selectById(event.data.merchantId);
                } else {
                    merchant = self.merchants.selectByDomain(Utils.getDomain(event.url));
                }

                if (merchant) {
                    framework.extension.fireEvent(CLOSE_ALL_NOTIFICATION, {
                        tabId: framework.browser.ALLTABS,
                        data: merchant.toJSON()
                    });
                }
            }
        });
        framework.extension.attachEvent(NOTIFICATION_GET_INFO, _.bind(self.globalPageHandler, self));
        framework.browser.attachEvent(framework.browser.DOCUMENTCOMPLETE, _.bind(self.globalPageHandler, self));
        framework.browser.attachEvent(framework.browser.TABCHANGED, _.bind(self.globalPageHandler, self));
        framework.extension.attachEvent(GET_RECOMMENDATIONS, (event, callback) => {
            let merchants = [...self.merchants.selectViewed(), ...self.merchants.selectRecommended()];
            merchants = merchants.reduce((prev, current) => {
                if (!prev.find(merchant => merchant.id == current.id)) {
                    prev.push(current);
                }

                return prev;
            }, []);

            callback && callback(merchants.slice(0, 6));
        });

        function safeJSONParse(string) {
            try {
                return string ? JSON.parse(string) : [];
            } catch (e) {
                console.log(e);
            }
        }

        framework.browser.attachEvent(framework.browser.BEFORENAVIGATE, function (event) {
            Storage.get('settings', function (data) {
                if (data && data.redirectUrl && data.redirectUrl.length > 0) {
                    var url = new URL(event.url);

                    var patternOwnerPage = null;
                    try {
                        patternOwnerPage = location.href.matchAll(CHECK_LETYSHOPS)[0][0];
                    } catch (e) {
                    }

                    if (new RegExp(patternOwnerPage, "i").test(url.host) && !new RegExp(patternOwnerPage, "i").test(new URL(data.redirectUrl).host)) {
                        framework.browser.navigate({
                                tabId: self.tabs.currentTabId,
                                url: data.redirectUrl + url.pathname + url.search
                            }
                        );
                    }
                }
            });
        });

        framework.extension.attachEvent(USER_NOTIFICATION_DISMISS, _.bind(self.usersNotifyDismiss, self));
        framework.extension.attachEvent(UPDATE_FAVORITE_STATUS_FROM_NOTIFICATION, _.bind(self.onFavoriteClick, self));
        framework.extension.attachEvent(ANIMATE_ICON, _.bind(self.animateIcon, self));
        framework.extension.attachEvent(SEND_GA_CID, _.bind(self.writeGoogleAnalyticsCID, self));
        framework.extension.attachEvent(SEND_ACTIVATION_DATA, _.bind(self.sendActivationData, self));
        framework.extension.attachEvent(SEND_THANKS_YOU_PAGE_DATA, _.bind(self.sendThanksYouPageData, self));
        framework.extension.attachEvent(SAW_REWRITE, _.bind(self.unRewrite, self));
        framework.extension.attachEvent(BUTTON_UPDATE, _.bind(function () {
            var self = this,
                merchant = self.get('currentMerchant') ? self.merchants.selectById(self.get('currentMerchant')) : false;
            if (!merchant) {
                Button.standard();
            } else if (merchant.get('isActivated')) {
                Button.green();
            } else {
                Button.red();
            }
        }, self));

        framework.extension.attachEvent(UPDATE_LETY_CODES, function () {
            self.user.rates.fetch(true);
        });

        framework.extension.attachEvent(LOAD_USER_LANGUAGE, function (event) {
            const language = !!event.data ? event.data.language : null;
            self.loadUserLanguage(language);
        });

        framework.extension.attachEvent(SEND_LETYTOOL_EVENT, function (event) {
            const user = self.user;
            let settings = {
                url: ApiClient.letyToolEvent(),
                type: "POST",
                headers: {
                    "Accept": "application/json",
                    "app-token": APP_TOKEN,
                    "extension-token": (user.attributes.tokenCookies && user.attributes.tokenCookies.eaetkn) ? user.attributes.tokenCookies.eaetkn : '',
                    "user-token": (user.attributes.tokenCookies && user.attributes.tokenCookies.eautkn) ? user.attributes.tokenCookies.eautkn : '',
                    "version-ext": framework.extension.version
                },
                data: JSON.stringify({
                    name: event.data.name,
                    data: event.data.data
                }),
                dataType: 'json'
            };
            $.ajax(settings).done();
        });

        framework.extension.attachEvent(REFRESH_ALL, async function () {
            if (!!self.user.isLogin()) {
                await self.user.fetchNotifications(true, function (value) {
                    self.user.set("notifications", value);
                    if (_.findWhere(value, {status: "1"})) {
                        Button.setBadge(_.where(value, {status: "1"}).length);
                    } else {
                        Button.clearCounter();
                    }
                }, true);
            }

            await self.promoNotifyHandlerAjax();
            await self.promoNotifyHandlerTimer();

            await self.merchants.fetchForce();
            await self.user.rates.fetch(true);
            await self.offers.fetchForce();
        });

        function generateAdvice(cb) {
            var tab = self.tabs.selectById(self.tabs.currentTabId);
            var tabLink = tab.get('url');

            Storage.get(tabLink, function (dataAdvice) {
                if (!dataAdvice || "undefined" === typeof dataAdvice || _.now() - dataAdvice.linkAdviceLastCreate > 60 * 1000) {
                    Storage.set(tabLink, null);

                    let settings = {
                        url: ApiClient.advices(),
                        type: "POST",
                        data: {
                            link: tabLink
                        },
                        dataType: 'json'
                    };
                    $.ajax(settings).done((data) => {
                        let adviceLinkData = {
                            link: tabLink,
                            adviceLink: data.link,
                            linkAdviceLastCreate: _.now()
                        };
                        Storage.set(tabLink, adviceLinkData);

                        cb && cb(adviceLinkData);
                    });
                } else {
                    cb && cb(dataAdvice);
                }
            });
        }

        if (framework.browser.name === 'Firefox') {
            browser.runtime.onMessage.addListener(function handleMessage(request, sender, sendResponse) {
                if (request.action === CREATE_ADVICES) {
                    generateAdvice(sendResponse);
                    return true;
                }
            });
        } else {
            framework.extension.attachEvent(CREATE_ADVICES, function () {
                generateAdvice((data) => framework.extension.fireEvent(RETURN_ADVICE_LINK, data));
            });
        }

        function getAliexpressPendingOrders() {
            return new Promise(resolve => {
                Storage.get('aliexpressPendingOrders', function (pendingOrdersRecord) {
                    pendingOrdersRecord = safeJSONParse(pendingOrdersRecord);

                    if (
                        pendingOrdersRecord &&
                        Date.now() - pendingOrdersRecord.createdAt < 3600000 &&
                        pendingOrdersRecord.user === self.user.attributes.token
                    ) {
                        resolve(pendingOrdersRecord.orders);
                    } else {
                        fetch(ApiClient.aliexpressPendingOrders(), {method: 'GET', credentials: 'include'})
                            .then(res => res.text())
                            .then(pendingOrders => {
                                const orders = safeJSONParse(pendingOrders);

                                const pendingOrdersRecord = JSON.stringify({
                                    createdAt: Date.now(),
                                    user: self.user.attributes.token,
                                    orders
                                });

                                Storage.set('aliexpressPendingOrders', pendingOrdersRecord);

                                resolve(orders);
                            });
                    }
                });
            })
        }

        function getAliexpressCacheOrders(orderId) {
            return new Promise((resolve, reject) => {
                Storage.get('deliveryHints', function (deliveryHintsRecords) {
                    const orders = safeJSONParse(deliveryHintsRecords) || [];

                    if (orderId) {
                        const order = orders.find(record => record.orderId == orderId);

                        if (order && Date.now() - order.createdAt < 3600000) {
                            resolve(order);
                        } else {
                            reject();
                        }
                    } else {
                        resolve(orders);
                    }
                });
            })
        }

        framework.extension.attachEvent(GET_ALIEXPRESS_ORDERS, function (request) {
            if (!self.user.attributes.token) {
                return;
            }

            const ordersArray = request.data || '';

            getAliexpressPendingOrders().then(pendingOrders => {
                ordersArray.forEach(orderId => {
                    if (pendingOrders.indexOf(orderId) !== -1) {
                        getAliexpressCacheOrders(orderId)
                            .then(order => {
                                if (order.delivered) {
                                    return framework.extension.fireEvent(RETURN_ALIEXPRESS_ORDERS, {data: orderId});
                                }
                            })
                            .catch(() => {
                                fetch(`https://ilogisticsaddress.aliexpress.com/ajax_logistics_track.htm?orderId=${orderId}`, {
                                    method: 'GET',
                                    credentials: 'include'
                                })
                                    .then(res => res.text())
                                    .then(textData => JSON.parse(textData.replace(' null(', '').slice(0, -1)))
                                    .then(trackData => {
                                        trackData = {
                                            orderId,
                                            createdAt: Date.now(),
                                            delivered: trackData && trackData.tracking && trackData.tracking[0] && trackData.tracking[0].keyDesc === 'Delivered'
                                        };

                                        getAliexpressCacheOrders().then(orders => {
                                            orders.push(trackData);
                                            Storage.set('deliveryHints', JSON.stringify(orders));
                                        });

                                        if (trackData.delivered) {
                                            return framework.extension.fireEvent(RETURN_ALIEXPRESS_ORDERS, {data: orderId});
                                        }
                                    })
                                    .catch(console.warn);
                            });
                    }
                });
            });
        });

        framework.extension.attachEvent(UPDATE_MERCHANTS_HOT_PRODUCTS, function (data) {
            var merchant = self.merchants.selectById(data.data.id);
            if (!!merchant && !!merchant.attributes) {
                merchant.attributes.hotProducts = data.data.hotProductsArr;
            }
        });

        framework.extension.attachEvent(GET_INFO_MERCHANT, function (data, callback) {
            Storage.get('firstShowTitleForUser', function (firstShowTitleForUser) {
                var firstShow = data.data.firstShow;
                if (!!firstShowTitleForUser) {
                    firstShow = false;
                } else {
                    if (!!firstShow) {
                        Storage.set('firstShowTitleForUser', true);
                    }
                }

                var domain = Utils.getDomain(data.data.dataUrlPage);
                var merchant = domain && self.merchants.selectByDomain(domain);
                if (!!merchant && !!merchant.attributes) {
                    var dataSearch = {
                        merchant: merchant.attributes,
                        firstShow: firstShow
                    };
                    callback && callback(!!merchant ? dataSearch : null);
                }
            });
        });

        framework.extension.attachEvent(GET_INFO_USER, function (data, callback) {
            callback && callback(self.user.toJSON());
        });

        framework.extension.attachEvent(SEND_ITEM_TO_WISH_LIST, function (event) {
            self.sendItemToWishList(self.user, event.data.itemInfo);
        });

        framework.extension.attachEvent(SEND_USER_SETTINGS, function (event) {
            self.pushLogUserSettings(event.data.type);
        });

        framework.extension.attachEvent(GET_PRICE_HISTORY, function (event, callback) {
            var priceHistory = self.getPriceHistory(event, self.user);
            callback && callback(priceHistory);
        });

        framework.extension.attachEvent(NOTIFICATION_GET_PRICE, _.bind(self.globalPriceHandler, self));

        framework.extension.attachEvent(NOTIFICATION_GET_SIMILAR_LIST, _.bind(self.globalSimilarListHandler, self));

        framework.extension.attachEvent(GET_TOKEN_COOKIES, _.bind(self.globalCashbackIsAvailableHandler, self));

        framework.extension.attachEvent(GET_RESPONSE_URL, function(event, callback) {
            callback && callback(self.getResponseURL(event));
        });

        framework.extension.attachEvent(GET_MERCHANT_BY_ID, function(event, callback) {
            const merchant = self.merchants.selectById(event.data.merchant_id);
            callback && callback({merchant: merchant.toJSON()});
        });

        framework.browser.attachEvent(framework.browser.BEFORENAVIGATE, function (event) {
            Storage.get('settings', function (data) {
                if (data && data.redirectUrl && data.redirectUrl.length > 0) {
                    var url = new URL(event.url);
                    var patternOwnerPage = null;
                    try {
                        patternOwnerPage = location.href.matchAll(CHECK_LETYSHOPS)[0][0];
                    } catch (e) {
                    }

                    if (patternOwnerPage === url.host
                        && url.host !== new URL(data.redirectUrl).host) {
                        framework.browser.navigate({
                                tabId: self.tabs.currentTabId,
                                url: data.redirectUrl + url.pathname + url.search
                            }
                        );
                    }
                }
            });
        });
    },

    /**
     *
     * @param event
     * @param callback
     */
    globalPriceHandler: function (event, callback) {
        var self = this;
        Storage.get('showPrice', async function (item) {
            if (item || typeof item === "undefined" || BROWSER_NAME_SAFARI === framework.browser.name) {
                var domain = Utils.getDomain(event.url);
                var tab = self.tabs.selectById(event.tabId);
                var user = self.user;
                var merchant = domain && self.merchants.selectByDomain(domain);
                if (merchant && (ARRAY_MERCHANTS_PRICE.includes(merchant.id))) {
                    const storageKey = event.data.id + '_' + (event.data.region ? event.data.region + '_' : '') + event.data.currencyDisplay;

                    let targetInfo = await Storage.syncGet(storageKey);

                    if (!targetInfo || _.now() - targetInfo.createdAt > UPDATE_INTERVAL_INFO_HISTORY_PRICE) {
                        targetInfo = self.getTargetInfo(event.url, self.user, event);
                        targetInfo.createdAt = _.now();
                        Storage.set(storageKey, targetInfo);
                    }

                    if (targetInfo && targetInfo.itemInfo && targetInfo.itemInfo.dynamic) {
                        if (targetInfo.itemInfo.dynamic.value > 0) {
                            targetInfo.itemInfo.dynamic.sign = '+';
                        } else if (targetInfo.itemInfo.dynamic.value < 0) {
                            targetInfo.itemInfo.dynamic.sign = '-';
                        } else {
                            targetInfo.itemInfo.dynamic.sign = '';
                        }

                        targetInfo.itemInfo.dynamic.value = Math.abs(targetInfo.itemInfo.dynamic.value);

                        targetInfo.itemInfo.dynamic.ItemDynamic = self.getDecodeItemDynamic(targetInfo);
                        if (event.data && _.compact(_.uniq(_.keys(event.data))).length) {
                            targetInfo.itemInfo.priceLast.dataPricePage = event.data;
                        }
                    }
                    if (targetInfo && targetInfo.itemInfo && targetInfo.itemInfo.seller) {
                        targetInfo.itemInfo.seller.resume.score.value = parseInt(targetInfo.itemInfo.seller.resume.score.value);
                        targetInfo.itemInfo.seller.resume.decodeNotes = self.getDecodeNotes(targetInfo);
                    }
                    var promo = merchant && merchant.get("hasPromoActivated") ? self.offers.get(+merchant.get("hasPromoActivated")) : null;
                    if (tab) {
                        merchant.attributes.extendedTab = tab.attributes;
                        merchant.attributes.extendedPromo = promo;
                        var data = {
                            merchant: merchant.attributes,
                            isLogin: user.isLogin(),
                            targetInfo: targetInfo ? targetInfo : ''
                        }
                    }
                }
                callback && callback(data ? data : null);
            }
        });
    },

    /**
     *
     * @param event
     * @param callback
     */
    globalSimilarListHandler: function (event, callback) {
        const similarRequestParams = event.data;
        similarRequestParams.url = event.url;

        let self = this,
            user = self.user,
            arrMerchants = [],
            similarList = self.getSimilarList(similarRequestParams, user);

        if (similarList && similarList.similarInfo) {
            _.each(similarList.similarInfo.list, function (item) {
                let domain = Utils.getDomain(item.url);
                let merchant = domain && self.merchants.selectByDomain(domain);

                if (merchant && merchant.attributes && merchant.get('settings').showInSimilar) {
                    const currency = {
                        RUB: 'руб.'
                    };

                    const price = item.priceLast && item.priceLast.currency && item.priceLast.currency.name === 'RUB'
                        && `${item.priceLast.min.toLocaleString('ru')} ${currency[item.priceLast.currency.name]}`;

                    arrMerchants.push({
                        id: merchant.get('id'),
                        targetId: item.id.id,
                        ext_referrer: encodeURIComponent(item.url),
                        similarInfo: {
                            isActivationEnabled: item.seller.isActivationEnabled,
                            url: item.url
                        },
                        title: merchant.get('title'),
                        price,
                        activateUrl: merchant.get('activateUrl'),
                        cashback: merchant.get('cashback'),
                        cashbackFloated: merchant.get('cashbackFloated'),
                        userCashback: merchant.get('userCashback')
                    });
                }
            });
        }

        let favorites = user.get('favorites');
        let recommended = user.get('recommended');
        let viewed = user.get('viewed');
        let top = self.merchants.select50First();


        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        let arr4 = [];
        let arr5 = [];

        for (let merchant of arrMerchants) {
            if (favorites.includes(merchant.id)) {
                arr1.push(merchant);
            } else if (recommended.includes(merchant.id)) {
                arr2.push(merchant);
            } else if (viewed.includes(merchant.id)) {
                arr3.push(merchant);
            } else if (top.includes(merchant.id)) {
                arr4.push(merchant);
            } else {
                arr5.push(merchant);
            }
        }

        arrMerchants = arr1.concat(arr2);
        arrMerchants = arrMerchants.concat(arr3);
        arrMerchants = arrMerchants.concat(arr4);
        arrMerchants = arrMerchants.concat(arr5);


        let data = {
            isLogin: !!user.isLogin(),
            similarList,
            arrMerchants
        };

        callback && callback(data ? data : null);

    },

    /**
     *
     * @param event
     * @param callback
     */
    globalPageHandler: function (event, callback) {
        var self = this;
        var domain = Utils.getDomain(event.url);
        var tab = self.tabs.selectById(event.tabId);
        var user = self.user;
        var merchant = domain && self.merchants.selectByDomain(domain);

        if (!!merchant && !!user && user.isLogin()
            && (!merchant.get('lastTimeCountPersonalCashback') || (_.now() - merchant.get('lastTimeCountPersonalCashback') > INTERVAL_COUNT_USER_CASHBACK_RATES))) {
            self.merchants.fetchUserCashbackRates(merchant);
        }

        if (merchant && self.tabs.currentTabId === event.tabId) {
            const {hostname} = new URL(event.url);

            if (merchant.get('id') === tmallID) {
                tab.set('initiatedBy', tmallID);

                const aliexpress = self.merchants.selectById(aliexpressID);

                if (aliexpress.get('isActivated')) {
                    aliexpress.reset();
                }
            }

            if (merchant.get('id') === aliexpressID && !aliexpressSharedDomains.includes(hostname)) {
                const tmall = self.merchants.selectById(tmallID);
                tab.set('initiatedBy', aliexpressID);

                if (tmall && tmall.get('isActivated')) {
                    tmall.reset();
                }
            }

            if (aliexpressSharedDomains.includes(hostname) && tab && tab.get('initiatedBy')) {
                merchant = self.merchants.selectById(tab.get('initiatedBy')) || merchant;
            }


            if (merchant.get("settings").partnerList || merchant.get("settings").partnerListNoActive) {
                user.rewriteViewed(merchant.id);
            }
            self.attributes.currentMerchant = merchant.id;
            var _visitedMerchant = self.attributes.visitedMerchants;
            if (!_.findWhere(_visitedMerchant, {shop_id: merchant.id})) {
                _visitedMerchant.push({
                    shop_id: merchant.id,
                    date: new Date().toISOString()
                });
                self.attributes.visitedMerchants = _visitedMerchant;
            }
            if (merchant && merchant.get("settings").browserAction && self.tabs.currentTabId === tab.id) {
                if (merchant.get("isActivated") && self.user.isLogin()) {
                    Button.green()
                } else if (merchant.get('animated') !== 'red' && !tab.get('animation')) {
                    merchant.set('animated', 'red');
                    tab.set('animation', true);
                    _.delay(function () {
                        tab.set('animation', false)
                    }, 1500);
                    framework.extension.fireEvent(ANIMATE_ICON, {tabId: null});
                } else {
                    Button.red();
                }
            } else if (merchant && self.tabs.currentTabId === tab.id) {
                Button.standard();
            }
        } else {
            self.attributes.currentMerchant = null;
            if (tab && self.tabs.currentTabId === tab.id)
                Button.standard();
        }

        if (!merchant || !tab || !domain) {
            return;
        }

        var tabState = tab && tab.get('state');

        var interstitialPageRegExp = null;
        try {
            interstitialPageRegExp = url.matchAll(CHECK_LETYSHOPS_VIEW)[0][0];
        } catch (e) {
        }

        if (event.name === framework.browser.DOCUMENTCOMPLETE && !new RegExp(interstitialPageRegExp, "i").test(event.url)) {
            tab.immediateReset();
        }

        if (!(TAB_STATE_INTERSTITIAL_REDIRECT === (tabState & TAB_STATE_INTERSTITIAL_REDIRECT))
            && (TAB_STATE_3RD_PARTY === (tabState & TAB_STATE_3RD_PARTY))) {
            merchant.trigger(MERCHANT_SUPPRESSED);
        } else if (TAB_STATE_INTERSTITIAL_REDIRECT === (tabState & TAB_STATE_INTERSTITIAL_REDIRECT)) {
            if (merchant && merchant.get("settings").browserAction && self.tabs.currentTabId === tab.id) {
                if (!tab.get('animation')) {
                    if (merchant.get("isActivated")) {
                        tab.set('animation', true);
                        _.delay(function () {
                            tab.set('animation', false)
                        }, 1500);
                        framework.extension.fireEvent(ANIMATE_ICON, {tabId: null});
                    } else {
                        Button.red();
                    }
                }
            }
        }
        var promo = merchant.get("hasPromoActivated") ? self.offers.get(+merchant.get("hasPromoActivated")) : null;
        merchant.attributes.extendedTab = tab && tab.attributes;
        merchant.attributes.extendedPromo = promo;

        callback && callback(merchant.attributes);
    },

    /**
     *
     * @param event
     * @returns {boolean}
     */
    globalCashbackIsAvailableHandler: function (event) {
        let self = this;
        let url = new URL(event.url);
        let tab = self.tabs.selectById(self.tabs.currentTabId);
        let referer = tab && tab.get('history') && tab.get('history').length > 0 ? tab.get('history')[tab.get('history').length - 1].referer : '';
        let user = application.user;
        if (event && event.data && _.compact(_.uniq(_.keys(event.data.tokenCookies))).length !== 0) {
            user.set({
                tokenCookies: event.data.tokenCookies
            });
        }

        let domain = Utils.getDomain(event.url);
        let merchant = domain && self.merchants.selectByDomain(domain);
        let isCashbackAvailable = merchant ? merchant.attributes.isCashbackAvailable : {};

        if (merchant && merchant.get('isCashbackAvailable') && (isCashbackAvailable.code === 0
            || isCashbackAvailable.code === 1 && _.now() - isCashbackAvailable.lastTimeRequest > isCashbackAvailable.expire)) {
            self.sendCashbackIsAvailable(user, url, referer);
            return true;
        } else {
            if (event.url.startsWith('http')) {
                Storage.get("ddList", function (ddList) {
                    if (ddList && !ddList.includes(url.host)) {
                        Storage.get('isCashbackAvailable', function (isCashbackAvailable) {
                            if (!isCashbackAvailable) {
                                self.sendCashbackIsAvailable(user, url, referer);
                            } else {
                                let listTmpUrls = [];
                                _.each(isCashbackAvailable, function (item) {
                                    listTmpUrls.push(item.url);
                                });
                                if (listTmpUrls.includes(url.host)) {
                                    _.each(isCashbackAvailable, function (item) {
                                        if (item.url === url.host && (item.code === 0
                                            || item.code === 1 && _.now() - item.lastTimeRequest > item.expire)) {
                                            self.sendCashbackIsAvailable(user, url, referer);
                                        }
                                    });
                                } else {
                                    self.sendCashbackIsAvailable(user, url, referer);
                                }
                            }
                        });
                    }
                });
            }
        }
    },

    /**
     * INTERSTITIAL PAGE
     * @param tab
     * @param url
     * @param options
     */
    initializeInterstitialPageActivationHandler: function (tab, url, options) {
        var self = this;
        if (!url) return;
        if (url.indexOf(ApiClient.domain) !== -1) {
            var interstitialPageRegExp = null;
            try {
                interstitialPageRegExp = url.matchAll(CHECK_LETYSHOPS_VIEW)[0][0];
            } catch (e) {
            }

            if (new RegExp(interstitialPageRegExp, "i").test(url)) {
                var id = parseInt(url.matchAll(CHECK_LETYSHOPS_VIEW)[0][1]);
                if (id) {
                    var merchant = self.merchants.selectById(id);
                    if (!merchant) {
                        merchant = _.filter(self.merchants.models, _.bind(function (model) {
                            return _.contains(model.get('promo'), parseInt(id))
                        }, self))
                    }
                    if (!!merchant) {
                        if (_.isArray(merchant)) {
                            merchant = merchant[0];
                        }
                        if (!!merchant) {
                            merchant.set({savedCookie: null});
                            merchant.reset && merchant.reset();
                            if (merchant && self.user && self.user.isLogin()) {
                                self.user && self.user.pushViewedMerchant(merchant.id);
                            }

                            merchant.set({
                                extendedTabThanksPage: {
                                    state: tab.get('state') | TAB_STATE_INTERSTITIAL_REDIRECT,
                                    interstitialPageId: id,
                                    shopId: id,
                                    interstitialPage: url,
                                    tabInfo: tab.attributes
                                }
                            });
                        }

                        tab.set('state', tab.get('state') | TAB_STATE_INTERSTITIAL_REDIRECT);
                        tab.set('interstitialPageId', id); // mark who interstitial page I was visited
                        tab.set('shopId', id);
                        tab.set('interstitialPage', url);


                    }
                }
            }
        } else {
            $.each(THIRD_PARTY_LINKS, function (i, link) {
                if (url.indexOf(link) !== -1) {
                    tab.set('state', tab.get('state') | TAB_STATE_3RD_PARTY);
                    return false;
                }
            });
        }
    },

    /**
     *
     * @param data
     */
    sendActivationData: function (data) {
        let self = this;
        let tab = data.data.tab.cid ? data.data.tab : self.tabs.selectById(data.data.tab.id);
        let merchant = data.data.merchant;
        let type = new RegExp('notification_re_activate_cashback').test(tab.get('interstitialPage')) ? 2 : 1;
        let _history = JSON.parse(JSON.stringify(tab.get('history')));
        let referer = _.findWhere(tab.get('history'), {url: tab.get('interstitialPage')}),
            activateData = {
                shop_id: merchant.id,
                type: type,
                interstitial_page: {
                    url: tab.get('interstitialPage') ? tab.get('interstitialPage') : '',
                    referer: referer && referer.referer ? referer && referer.referer : '',
                    date: referer && referer.date ? referer && referer.date : ''
                },
                cookies: self.merchants.selectById(merchant.id).get('savedCookie'),
                transitions: _history ? _history : ''
            };
        self.merchants.selectById(merchant.id).activationLog = activateData;
        let settings = {
            url: ApiClient.logActivate(),
            type: "POST",
            data: activateData,
            dataType: 'json'
        };
        $.ajax(settings).done();
    },

    /**
     *
     * @param event
     */
    sendThanksYouPageData: function (event) {
        var self = this;
        var domain = Utils.getDomain(event.url);
        var tab = self.tabs.selectById(event.tabId);
        var merchant = domain && self.merchants.selectByDomain(domain) && self.merchants.selectByDomain(domain).attributes;

        if (merchant && merchant.thankyoupage && merchant.thankyoupage.length > 0
            && tab.attributes.url.indexOf(merchant.thankyoupage[0].url) > 0) {
            const tmall = self.merchants.selectById(tmallID);

            if (merchant.id === aliexpressID && (!merchant.isActivated || merchant.isActivated === undefined)
                && tmall && tmall.get('isActivated')) {
                merchant = tmall.attributes;
            }


            let _history = JSON.parse(JSON.stringify(!!merchant.extendedTabThanksPage ? merchant.extendedTabThanksPage.tabInfo.history : tab.get('history')));

            let referer = _.findWhere(_history,
                (!!merchant.extendedTabThanksPage ? merchant.extendedTabThanksPage.interstitialPage : _history[_history.length - 1].url));

            let thanksYouPageData = {
                shop_id: merchant.id,
                is_extension_active: merchant.isActivated,
                interstitial_page: {
                    url: !!merchant.extendedTabThanksPage ? merchant.extendedTabThanksPage.interstitialPage : tab.get('url'),
                    referer: referer && referer.referer ? referer && referer.referer : tab.get('url'),
                    date: referer && referer.date ? referer && referer.date : ''
                },
                cookies: merchant.savedCookie,
                transitions: _history
            };
            if (!!self.merchants.selectById(merchant.id)) {
                self.merchants.selectById(merchant.id).thanksYouPageData = thanksYouPageData;
            }
            let settings = {
                url: ApiClient.logThanksGiving(),
                type: "POST",
                data: thanksYouPageData,
                dataType: 'json'
            };
            $.ajax(settings).done();

            self.sendGoogleAnalyticsEvent('LetyTracking', 'lt_view_thank_you_page_1', merchant.id);
        }
    },

    /**
     * USER NOTIFY
     */
    usersNotifyHandler: function () {
        var self = this;

        if (!!self.user.isLogin()) {
            var notifications = self.user.get("notifications");
            var filteredNotifications = _.where(notifications, {"status": "1", showed: false});

            if (filteredNotifications && filteredNotifications.length) {
                self.user.set("notifications", _.map(notifications, function (notification) {
                    notification.showed = true;
                    return notification;
                }));
                Storage.get("showed_notifications", function (lastShowedNotifications) {
                    var updatedShowedNotifications;
                    if (lastShowedNotifications || typeof lastShowedNotifications === "string") {
                        lastShowedNotifications = JSON.parse(lastShowedNotifications);
                        filteredNotifications = _.filter(filteredNotifications, function (n) {
                            return !_.contains(lastShowedNotifications, n.id);
                        });
                        updatedShowedNotifications = lastShowedNotifications.concat(_.pluck(filteredNotifications, "id"));
                    } else {
                        updatedShowedNotifications = _.pluck(filteredNotifications, "id");
                    }
                    Storage.set("showed_notifications", JSON.stringify(updatedShowedNotifications));
                    if (filteredNotifications && filteredNotifications.length) {
                        $.each(filteredNotifications, function (i, value) {
                            var notify = self.createNotification(
                                value['markup'].replace(/<\/?[^>]+(>|$)/g, ""),
                                'images/btn/logo65.png',
                                $.i18n("titleCreateNotification")
                            );

                            notify.onclose = _.bind(function (event) {
                                self.user.pushReviewedNotifications(value.id)
                            }, this);
                            notify.onclick = _.bind(function () {
                                var browser = Utils.getFullInfo().browser === BROWSER_NAME_YABROWSER
                                    ? 'yabrowser'
                                    : framework.browser.name.toLowerCase();
                                framework.browser.navigate({
                                        tabId: framework.browser.NEWTAB,
                                        url: ApiClient._root + value['url'] + '&utm_term=' + browser,
                                    }
                                );
                                self.user.pushReviewedNotifications(value.id);
                                notify.close();
                            }, this);
                        });
                    }
                });
            }
        }

        clearInterval(self.intervalUsersNotifyHandler);
        self.intervalUsersNotifyHandler = setInterval(function () {
            self.usersNotifyHandler();
        }, USER_NOTIFY_INTERVAL);

    },

    /**
     * get data from ajax for promo Notify
     */
    promoNotifyHandlerAjax: async function () {
        var self = this;

        const locale = await Storage.syncGet('locale');

        let settings = {
            url: ApiClient.promoNotifications() + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY)),
            type: "GET",
            dataType: 'json'
        };
        $.ajax(settings).done((data) => {
            Storage.set('promoNotifications', data);
        });

        clearInterval(self.intervalPromoNotifyHandlerAjax);
        self.intervalPromoNotifyHandlerAjax = setInterval(function () {
            self.promoNotifyHandlerAjax();
        }, PROMO_NOTIFY_PERIOD);
    },


    /**
     * promo Notifications for users
     */
    promoNotifyHandler: function () {
        var self = this;
        var promoNotifications = "promoNotifications";
        var tab = self.tabs.selectById(self.tabs.currentTabId);

        Storage.get("showPromoNotifications", function (showPromoNotifications) {
            if ((typeof showPromoNotifications === "undefined" || showPromoNotifications) && tab && tab.attributes) {
                var url = new URL(tab.get('url'));
                Storage.get(promoNotifications, function (data) {
                    if (data) {
                        $.each(data, function (i, value) {
                            if ((value["domains"].includes('*') || value["domains"].includes(url.origin))
                                && _.now() > new Date(value["_notificateAt"]).getTime()
                                && _.now() < new Date(value["_expireAt"]).getTime()) {

                                Storage.get(promoNotifications + "_" + i, function (result) {
                                    if (!result) {
                                        showPush(value, function () {
                                            Storage.set(promoNotifications + "_" + i, true);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        function showPush(value, cb) {
            var imageLogo = 'images/btn/logo65.png';
            if (value['_href_logo'] || value['_href_logo'].startsWith('http')) {
                imageLogo = value['_href_logo'];
            }
            if (framework.browser.name !== BROWSER_NAME_FF) {
                var notify = self.createNotification(value['message'], imageLogo, value['title']);
                notify.onclick = _.bind(function () {
                    framework.browser.navigate({
                            tabId: framework.browser.NEWTAB,
                            url: value['_href']
                        }
                    );
                    notify.close();
                }, this);
                if (typeof cb === 'function') {
                    cb();
                }
            } else if (framework.browser.name === BROWSER_NAME_FF) {
                var notificationId = value['_href'];
                var optons = {
                    "type": "basic",
                    "iconUrl": imageLogo,
                    "title": value['title'],
                    "message": value['message']
                };

                chrome.notifications.create(notificationId, optons);

                chrome.notifications.onClicked.addListener(function (notificationId) {
                    framework.browser.navigate({
                            tabId: framework.browser.NEWTAB,
                            url: value['_href']
                        }
                    );
                    chrome.notifications.clear(notificationId);
                });
                if (typeof cb === 'function') {
                    cb();
                }
            }
        }
    },

    /**
     *
     */
    promoNotifyHandlerTimer: function () {
        var self = this;
        clearInterval(self.intervalPromoNotifyHandler);
        self.intervalPromoNotifyHandler = setInterval(function () {
            self.promoNotifyHandler();
        }, PROMO_NOTIFY_INTERVAL);
    },

    /**
     * DON'T USE
     */
    usersNotifyDismiss: function (event, callback) {
        var self = this;
        if (event.data) {
            self.user && self.user.pushReviewedNotifications(event.data);
        }
        callback && callback();
    },

    /**
     * INITIALIZE HANDLERS (PARAMS, COOKIE)
     */
    initializeParamsHandler: function () {
        var self = this;
        framework.extension.attachEvent(GET_EXTENSION_INFO, function (event) {
            framework.extension.fireEvent(SEND_EXTENSION_INFO, {
                tabId: event.tabId,
                data: {version: framework.extension.version, name: framework.extension.name}
            });
        });
    },

    /**
     * HANDLER OF CHECKING REWRITE COOKIE
     */
    initializeCookieHandler: function () {
        var self = this;
        framework.extension.attachEvent(SET_MERCHANT_COOKIES, function (event, callback) {
            if (event.data) {
                var merchant = self.merchants.selectById(event.data.merchantId);
                merchant.set("savedCookie", event.data.cookie);
            }
        });
        framework.extension.attachEvent(CASHBACK_DEACTIVATE, function (event, callback) {
            if (event.data) {
                let merchant = self.merchants.selectById(event.data.merchantId);
                let tab = self.tabs.selectById(self.tabs.currentTabId);
                let savedCookie = merchant.attributes.savedCookie;
                if (merchant.attributes.rewrite === false) {
                    Button.red();
                    merchant.reset();
                    merchant.set({rewrite: true});
                    let settings = {
                        url: ApiClient.logRewrite(),
                        type: "POST",
                        data: {
                            shop_id: merchant.id,
                            rewrite_type: "cookie",
                            transitions: (merchant.activationLog && merchant.activationLog.transitions) || (tab && tab.get('history')),
                            data: {
                                checkCookieParams: merchant.attributes.checkCookieParams,
                                savedCookie: savedCookie,
                                pageCookies: event.data.pageCookies
                            }
                        },
                        dataType: 'json'
                    };
                    $.ajax(settings).done();
                }
            }
        });
        framework.extension.attachEvent(CHECK_MERCHANT_COOKIES, function (event, callback) {
            var domain = Utils.getDomain(event.url);
            var merchant = domain && self.merchants.selectByDomain(domain);
            if (merchant && merchant.get("checkCookieParams") && merchant.get("checkCookieParams").length) {
                callback && callback({merchant: merchant.toJSON()});
            }
        });
        framework.extension.attachEvent(CLEAR_COOKIES, function (event, callback) {
            var domain = Utils.getDomain(event.url);
            var merchant = domain && self.merchants.selectByDomain(domain);
            if (merchant) {
                merchant.set('savedCookie', null);
            }
        });
    },

    /**
     * HANDLER OF CHECKING REWRITE PARAMS
     */
    onParameterResearch: function (event) {
        var self = this;
        var url = event.url;
        var domain = Utils.getDomain(url);
        var checkedParams = {};
        var tab = self.tabs.selectById(event.tabId);

        var merchant = domain && self.merchants.selectByDomain(domain);

        if (aliexpressSharedDomains.includes(new URL(url).hostname) && tab && tab.get('initiatedBy')) {
            merchant = self.merchants.selectById(tab.get('initiatedBy')) || merchant;
        }

        if (merchant && merchant.get("checkUrlParams") && merchant.get("checkUrlParams").length && merchant.get("isActivated")) {
            var checkParamsCollection = merchant.get("checkUrlParams");
            if (merchant.get("savedParams") && merchant.get("savedParams").length > 0) {
                var cashbackParams = merchant.get("savedParams");
                var flag;

                if (_.keys(Utils.getAllUrlParams(url)).length > 0) {
                    var checkFlagParams = true;
                    _.each(cashbackParams, function (params) {
                        if (checkFlagParams) {
                            var rightSetForCheck = _.filter(checkParamsCollection, function (checkParamsSet) {
                                return _.isEqual(_.keys(checkParamsSet), _.keys(params));
                            });
                            _.each(rightSetForCheck[0], function (pattern, paramName) {
                                var firstParamValue = new RegExp(paramName.replace("$", "\\$") + "=([^&]+)", "i").exec(decodeURIComponent(url));
                                if (firstParamValue) {
                                    var paramValue = new RegExp(paramName.replace("$", "\\$") + "=([^;]+)", "i").exec(decodeURIComponent(decodeURIComponent(firstParamValue[0])));
                                    if (paramValue !== null && new RegExp(pattern, "i").test(paramValue[1])) {
                                        return checkedParams[paramName] = paramValue[1].split(' ').join('+');
                                    }
                                    return checkedParams[paramName] = null;
                                }
                            });

                            if (JSON.stringify(_.keys(checkedParams)) === JSON.stringify(_.keys(params))) {
                                flag = JSON.stringify(params) === JSON.stringify(checkedParams);
                            } else if (_.compact(_.uniq(_.values(checkedParams))).length !== 0) {
                                flag = true;
                                _.each(checkedParams, function (item, keyItem) {
                                    if (Object.keys(params).indexOf(keyItem) !== -1) {
                                        var flagTmp = Object.values(params).indexOf(item) !== -1;
                                        if (!flagTmp) {
                                            flag = flagTmp;
                                        }
                                    }
                                });
                            } else {
                                flag = true;
                            }
                            if (!flag) {
                                checkFlagParams = false;
                            }
                        }

                    });
                } else {
                    flag = true;
                }

                if (!flag) {
                    // deactivate merchant because params were rewritten
                    let settings = {
                        url: ApiClient.logRewrite(),
                        type: "POST",
                        data: {
                            shop_id: merchant.id,
                            rewrite_type: "get",
                            transitions: (tab && tab.get('history'))
                                || (merchant.activationLog && merchant.activationLog.transitions),
                            data: {
                                checkUrlParams: merchant.attributes.checkUrlParams,
                                savedParams: merchant.attributes.savedParams,
                                checkedParams: checkedParams
                            }
                        },
                        dataType: 'json'
                    };
                    $.ajax(settings).done();
                    merchant.reset();
                    merchant.set({rewrite: true});
                    if (self.tabs.currentTabId === event.tabId) {
                        Button.red();
                    }
                    merchant.unset('isActivated');
                    merchant.set('extendedTabThanksPage');
                }
            }
        }

    },

    onParameterSave: function (event) {
        var self = this;
        var url = event.url,
            domain = Utils.getDomain(url),
            merchant = self.merchants.selectByDomain(domain);


        if (_.keys(Utils.getAllUrlParams(url)).length > 0 ||
            _.keys(Utils.getAllUrlParams(url)).length === 0 && "undefined" !== typeof merchant.get('mainFrame')) {
            if (merchant && merchant.get("checkUrlParams") && merchant.get("checkUrlParams").length && !merchant.get("isActivated") && !merchant.get("savedParams")) {
                var checkParamsCollection = merchant.get("checkUrlParams");
                var complete = false;
                var params = [];

                _.each(checkParamsCollection, function (checkParamsSet) {
                    if (complete) {
                        return;
                    }
                    var paramValues = _.chain(checkParamsSet)
                        .map(function (pattern, paramName) {
                            var firstParamValue = new RegExp(paramName.replace("$", "\\$") + "=([^&]+)", "i").exec(decodeURIComponent(url));
                            if (firstParamValue) {
                                var paramValue = new RegExp(paramName.replace("$", "\\$") + "=([^;]+)", "i").exec(decodeURIComponent(decodeURIComponent(firstParamValue[0])));
                                if (paramValue !== null && new RegExp(pattern, "i").test(paramValue[1])) {
                                    return [paramName, paramValue[1].split(' ').join('+')];
                                }
                                return [paramName, null];
                            }
                        })
                        .compact()
                        .object()
                        .value();

                    var clearParamValues = [];
                    $.each(paramValues, function (index, value) {
                        clearParamValues.push(value);
                    });

                    if (clearParamValues.length > 0 && !clearParamValues.includes(null)) {
                        params.push(paramValues);
                    }
                });
                if (params && params.length > 0) {
                    merchant.set("savedParams", params);
                }
                return true;
            } else if (merchant && !merchant.get('isActivated') && !merchant.get('rewrite') && _.isEmpty(merchant.get("checkUrlParams"))) {
                this.unset("mainFrame");
                merchant.set("isActivated", true);
                merchant.trigger(CASHBACK_ACTIVATE);
            }
        } else {
            merchant.set("mainFrame", true);
        }
    },

    unRewrite: function (data) {
        var self = this,
            merchant = self.merchants.selectById(data.data.id);
        merchant.set({rewrite: false});
        merchant.reset();
        merchant.resetSavedParams();
    },

    /**
     * FAVORITE HANDLERS
     */
    onFavoriteClick: function (event) {
        var self = this;
        if (event.data) {
            var id = event.data.id;
            var isFavorite = event.data.isFavorite;
            isFavorite ? self.user.pushDisliked(id) : self.user.pushLiked(id);
            var merchant = self.merchants.selectById(id);
            merchant.set("isFavorite", !isFavorite);
        }
    },

	updateFavoriteStatusInContent: function (data) {
        framework.extension.fireEvent(UPDATE_FAVORITE_STATUS_FROM_BG,
            {
                tabId: framework.browser.ALLTABS,
                data: data
            }
        );
    },

    /**
     * POPUP BEHAVIOR
     */
    initPopup: function () {
        var self = this;
        framework.ui.button.setPopup({
            'url': 'popup/popup.html',
            'width': POPUP_WIDTH,
            'height': POPUP_HEIGHT
        });
    },

    onPopupFirstOpening: function () {
        Button.setBadge("");
        Storage.get(POPUP_FIRST_OPENING_TOKEN, function (token) {
            if (!token) {
                Storage.set(POPUP_FIRST_OPENING_TOKEN, "Wow!");
            }
        });
    },

    /**
     * ACTIVITIES AFTER INSTALL OR DELETE EXTENSION (chrome)
     */
    onInstalledAndDelete: function () {
        var self = this;
        Storage.get('afterInstallPageIsShown', function (afterInstallPageIsShown) {
                if (!afterInstallPageIsShown) {
                    Storage.set('afterInstallPageIsShown', true);

                    //log after install
                    self.pushLogInstall();

                    //after install
                    _.delay(function () {
                        framework.browser.navigate({
                            tabId: framework.browser.NEWTAB, url: ApiClient.afterInstall()
                        })
                    }, 500);
                    //after delete
                    var browser = framework.browser.name;
                    if (browser === BROWSER_NAME_CHROME) {
                        chrome.runtime.setUninstallURL(ApiClient.afterDelete());
                    } else if (browser === BROWSER_NAME_FF) {
                        var UninstallObserver = {
                            'onUninstalling': function (ffaddon) {
                                if (ffaddon['id'] === 'letyshops@LetyShops') {
                                    framework.browser.navigate({
                                        tabId: framework.browser.NEWTAB,
                                        url: ApiClient.afterDelete()
                                    });
                                }
                            },
                            'register': function () {
                                var observerService = Components['classes']['@mozilla.org/observer-service;1']['getService'](Components['interfaces']['nsIObserverService']);
                                observerService['addObserver'](UninstallObserver, 'quit-application-granted', false);
                                Components['utils']['import']('resource://gre/modules/AddonManager.jsm');
                                AddonManager['addAddonListener'](UninstallObserver);
                            }
                        };
                        UninstallObserver.register();
                    }
                }
            }
        );
    },

    pushLogInstall: function () {
        var self = this;
        var user = self.user;
        if (user && user.isLogin()) {
            let inf = Utils.getFullInfo();
            let settings = {
                url: ApiClient.logInstall(),
                type: "POST",
                data: {
                    os: inf.os,
                    browser: inf.browser,
                    browser_version: inf.version,
                    extension_version: framework.extension.version
                },
                dataType: 'json'
            };
            $.ajax(settings).done();
            clearInterval(self.intervalPushLogInstall);
        } else {
            clearInterval(self.intervalPushLogInstall);
            self.intervalPushLogInstall = setInterval(function () {
                self.pushLogInstall(ApiClient.logInstall());
            }, INTERVAL_PUSH_LOG);
        }
    },

    /**
     *
     * @param type
     */
    pushLogUserSettings: function (type) {
        let self = this;
        let user = self.user;
        if (user && user.isLogin()) {
            Storage.get('userSettings', function (data) {
                let userSettings = {};
                if (!!data) {
                    userSettings = data;
                } else {
                    userSettings = {
                        showPrice: true,
                        showUserNotifications: true,
                        showPromoNotifications: true,
                        showCashbackHints: true,
                        showSimilarList: true
                    };
                    Storage.set('userSettings', userSettings);
                }
                let settings = {
                    url: ApiClient.logUserSettings(),
                    type: "POST",
                    data: {
                        type: type,
                        settings: userSettings
                    },
                    dataType: 'json'
                };
                $.ajax(settings).done();
            });

        }
    },

    pushLogRequest: function () {
        let self = this;
        let user = self.user;
        let timePushLogRequest = 'timePushLogRequest';
        Storage.get('afterInstallPageIsShown', function (afterInstallPageIsShown) {
            if (afterInstallPageIsShown) {
                Storage.get(timePushLogRequest, function (result) {
                    if (!result || _.now() - result > UPDATE_LOG_REQUEST) {
                        if (user && user.isLogin()) {
                            let inf = Utils.getFullInfo();
                            let settings = {
                                url: ApiClient.logRequest(),
                                type: "POST",
                                data: {
                                    os: inf.os,
                                    browser: inf.browser,
                                    browser_version: inf.version,
                                    extension_version: framework.extension.version
                                },
                                dataType: 'json'
                            };
                            $.ajax(settings).done();
                            clearInterval(self.intervalShotPushLogRequest);
                            Storage.set(timePushLogRequest, _.now());
                        }
                    }
                });
            }
        });
    },

    //TODO: Что то сделать с этим...
    periodicPushViewedMerchant: function (data, url) {
        var self = this;
        //post
        // if (data) {
        //     $.ajax({
        //             url: url,
        //             type: "POST",
        //             data: {shops_viewed: data},
        //             processData: true,
        //             error: function (jqXHR, textStatus, errorThrown) {
        //                 if (jqXHR.status == '400' || jqXHR.statusText == "Bad Request") {
        //                     framework.extension.log("pushViewedMerchant - Forbidden");
        //                 }
        //             }
        //         }
        //     );
        // }
    },

    /**
     * ICON ANIMATION
     */
    ease: function (x) {
        return (1 - Math.sin(Math.PI / 2 + x * Math.PI)) / 2;
    },

    initializeIconAnimation: function () {
        var self = this;
        $(function () {
            $('<canvas/>', {
                id: 'canvas_id',
                width: 19,
                height: 19
            }).appendTo('body');

            $('#canvas_id').attr('width', 19).attr('height', 19);

            $('<img/>', {
                id: 'animate_icon',
                src: 'images/btn/logo19colorful.svg'
            }).appendTo('body');

            self.animationFrames = framework.browser.name === 'Safari' ? 1 : 270;
            self.animationSpeed = 1;
            self.canvas = document.getElementById('canvas_id');
            self.animateIco = document.getElementById('animate_icon');
            self.canvasContext = self.canvas.getContext('2d');
            self.rotation = 0;
        });

    },

    animateIcon: function (iconPath) {
        var self = this;
        iconPath = 'images/btn/logo19colorful.svg';
        self.rotation += 1 / self.animationFrames;
        self.drawRotatedIcon();

        if (self.rotation <= 1) {
            setTimeout(function () {
                self.animateIcon(iconPath);
            }, self.animationSpeed);
        } else {
            self.rotation = 0;
            self.firstAnimation = false;
            var merchant = self.get('currentMerchant') ? self.merchants.selectById(self.get('currentMerchant')) : false;
            if (!merchant) {
                Button.standard();
            } else if (merchant && merchant.get('isActivated')) {
                Button.green()
            } else {
                Button.red()
            }
        }
    },

    drawRotatedIcon: function () {
        var self = this;
        self.canvasContext.save();
        self.canvasContext.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.canvasContext.translate(
            Math.ceil(self.canvas.width / 2),
            Math.ceil(self.canvas.height / 2));
        self.canvasContext.rotate(8 * Math.PI * self.ease(self.rotation));
        self.canvasContext.drawImage(self.animateIco,
            -Math.ceil(self.canvas.width / 2),
            -Math.ceil(self.canvas.height / 2));
        self.canvasContext.restore();

        framework.ui.button.setIcon(self.canvas.toDataURL());
    },

    createNotification: function (Body, Icon, Title) {
        let options = {
            body: Body,
            icon: Icon,
        };
        return new Notification(Title, options);
    },

    /**
     * google analytics
     */
    initializeGoogleAnalyticsHandler: function () {
        const clientId = this.user.get('googleAnalyticsCID');
        const self = this;
        ga('create', googleAnalyticsTID, clientId ? {clientId} : 'auto');
        ga('set', 'checkProtocolTask', null);
        ga('set', 'checkStorageTask', null);
        ga('set', {'dimension1': 'GAtoBigQueryTest'});

        framework.extension.attachEvent(SEND_GOOGLE_ANALYTICS, function (event) {
            let data = event.data;
            if (data.type === 'pageview') {
                self.sendGoogleAnalyticsPageView(data.page);
            } else if (data.type === 'event') {
                self.sendGoogleAnalyticsEvent(data.category, data.action, data.label, data.value);
            }
        });
    },

    writeGoogleAnalyticsCID: function (event) {
        this.user.set('googleAnalyticsCID', event.data);
    },

    sendGoogleAnalyticsPageView: function (documentPage) {
        ga('send', 'pageview', documentPage);
    },

    sendGoogleAnalyticsEvent: function (category, action, label, value) {
        ga('send', 'event', category, action, label, value);
    },

    rivalAddListHandlerAjax: async function () {
        var self = this;
        const locale = await Storage.syncGet('locale');
        let settings = {
            url: ApiClient.ddList() + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY)),
            type: "get",
            dataType: 'json'
        };
        $.ajax(settings)
            .done((data) => {
                Storage.set('ddList', data);
            });
        clearInterval(self.intervalRListHandlerAjax);
        self.intervalRListHandlerAjax = setInterval(function () {
            self.promoNotifyHandlerAjax();
        }, R_LIST_ADD_PERIOD);
    },

    /**
     *
     * @param user
     * @param url
     * @param referer
     */
    sendCashbackIsAvailable: function (user, url, referer) {
        let self = this;
        let settings = {
            async: true,
            crossDomain: true,
            url: ApiClient.cashbackIsAvailable(),
            method: "GET",
            headers: {
                "app-token": APP_TOKEN,
                "extension-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eaetkn ? user.attributes.tokenCookies.eaetkn : '',
                "user-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eautkn ? user.attributes.tokenCookies.eautkn : '',
                "accept": "application/json",
                "referrer": referer,
                "version-ext": framework.extension.version
            },
            data: {
                url: url.href
            },
            dataType: 'json'
        };

        $.ajax(settings).done(function (response) {
            let domain = Utils.getDomain(url.origin);
            let merchant = domain && self.merchants.selectByDomain(domain);
            if (merchant) {
                merchant.set({
                    isCashbackAvailable: {
                        code: response.code,
                        expire: response.expire * 1000,
                        lastTimeRequest: _.now()
                    }
                });
            } else {
                Storage.get('isCashbackAvailable', function (isCashbackAvailable) {
                    if (!isCashbackAvailable) {
                        isCashbackAvailable = [];
                        isCashbackAvailable.push({
                            url: url.host,
                            code: response.code,
                            expire: response.expire * 1000,
                            lastTimeRequest: _.now()
                        });
                        Storage.set('isCashbackAvailable', isCashbackAvailable);
                    } else {
                        let listUrls = [];
                        _.each(isCashbackAvailable, function (item) {
                            listUrls.push(item.url);
                        });
                        if ($.inArray(url.host, listUrls) !== -1) {
                            _.each(isCashbackAvailable, function (item) {
                                if (url.host === item.url) {
                                    item.url = url.host;
                                    item.code = response.code;
                                    item.expire = response.expire * 1000;
                                    item.lastTimeRequest = _.now();
                                }
                            });
                            Storage.set('isCashbackAvailable', isCashbackAvailable);
                        } else {
                            isCashbackAvailable.push({
                                url: url.host,
                                code: response.code,
                                expire: response.expire * 1000,
                                lastTimeRequest: _.now()
                            });
                            Storage.set('isCashbackAvailable', isCashbackAvailable);
                        }
                    }
                });
            }
        });
    },

    /**
     *
     * @param url
     * @param user
     * @param dataPage
     */
    getTargetInfo: function (url, user, dataPage) {

        return function () {
            let result = null;
            let dataPageLength = _.compact(_.uniq(_.keys(dataPage.data))).length;

            let settings = {
                async: false,
                crossDomain: true,
                url: ApiClient.itemInfo(),
                type: "GET",
                headers: {
                    "Accept": "application/json",
                    "app-token": APP_TOKEN,
                    "extension-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eaetkn ? user.attributes.tokenCookies.eaetkn : '',
                    "user-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eautkn ? user.attributes.tokenCookies.eautkn : '',
                    "version-ext": framework.extension.version
                },
                data: {
                    url: url,
                    priceMin: dataPage && dataPageLength !== 0 ? dataPage.data.priceMin : '',
                    priceMax: dataPage && dataPageLength !== 0 ? dataPage.data.priceMax : '',
                    currency: dataPage && dataPageLength !== 0 ? dataPage.data.currency : '',
                    priceMinDisplay: dataPage && dataPageLength !== 0 ? dataPage.data.priceMinDisplay : '',
                    priceMaxDisplay: dataPage && dataPageLength !== 0 ? dataPage.data.priceMaxDisplay : '',
                    currencyDisplay: dataPage && dataPageLength !== 0 ? dataPage.data.currencyDisplay : '',
                    timezone: dataPage && dataPageLength !== 0 ? dataPage.data.timezone : ''
                },
                dataType: 'json'
            };

            $.ajax(settings).done(function (data) {
                result = data
            });
            return result;
        }();
    },

    /**
     *
     * @param url
     * @param user
     * @returns {*}
     */
    getHotInfo: function (url, user) {
        return function () {
            let result = null;

            let settings = {
                async: false,
                crossDomain: true,
                url: ApiClient.itemHot(),
                type: "GET",
                headers: {
                    "Accept": "application/json",
                    "app-token": APP_TOKEN,
                    "extension-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eaetkn ? user.attributes.tokenCookies.eaetkn : '',
                    "user-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eautkn ? user.attributes.tokenCookies.eautkn : '',
                    "version-ext": framework.extension.version
                },
                data: {
                    url: url
                },
                dataType: 'json'
            };

            $.ajax(settings).done(function (data) {
                result = data
            });
            return result;
        }();
    },

    /**
     * @param event
     */
    getResponseURL(event) {
        let result = '';
        const xhr = jQuery.ajaxSettings.xhr();
        
        $.ajax({
            async: false,
            url: event.data.url,
            xhr: function() {
                return xhr;
            },
        }).done(function () {
            result = xhr.responseURL
        });

        return 'ext_referrer=' + result;
    },

    /**
     *
     * @param event
     * @param user
     */
    getPriceHistory: function (event, user) {
        const itemInfo = event.data.itemInfo;
        const dataPricePage = itemInfo.priceLast.dataPricePage;
        const dataPageLength = _.compact(_.uniq(_.keys(dataPricePage))).length;

        return function () {
            let result = null;

            let settings = {
                async: false,
                crossDomain: true,
                url: ApiClient.itemHistory(),
                type: "GET",
                headers: {
                    "Accept": "application/json",
                    "app-token": APP_TOKEN,
                    "extension-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eaetkn ? user.attributes.tokenCookies.eaetkn : '',
                    "user-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eautkn ? user.attributes.tokenCookies.eautkn : '',
                    "version-ext": framework.extension.version
                },
                data: {
                    id: itemInfo.id.id,
                    type: itemInfo.id.type,
                    priceMin: itemInfo && dataPageLength !== 0 ? dataPricePage.priceMin : '',
                    priceMax: itemInfo && dataPageLength !== 0 ? dataPricePage.priceMax : '',
                    currency: itemInfo && dataPageLength !== 0 ? dataPricePage.currency : '',
                    priceMinDisplay: itemInfo && dataPageLength !== 0 ? dataPricePage.priceMinDisplay : '',
                    priceMaxDisplay: itemInfo && dataPageLength !== 0 ? dataPricePage.priceMaxDisplay : '',
                    currencyDisplay: itemInfo && dataPageLength !== 0 ? dataPricePage.currencyDisplay : '',
                    timezone: itemInfo && dataPageLength !== 0 ? dataPricePage.timezone : ''
                },
                dataType: 'json'
            };

            $.ajax(settings).done(function (data) {
                result = data
            });
            return result;
        }();
    },

    /**
     *
     * @param user
     * @param itemInfo
     */
    sendItemToWishList: function (user, itemInfo) {
        let data = {
            itemId: {
                id: itemInfo.id.id,
                type: itemInfo.id.type
            },
            wishState: {
                state: 1
            }
        };

        if (user.attributes.tokenCookies && _.compact(_.uniq(_.keys(user.attributes.tokenCookies))).length !== 0) {
            let settings = {
                async: true,
                crossDomain: true,
                url: ApiClient.itemWishUpdate(),
                method: "POST",
                data: JSON.stringify(data),
                dataType: 'json',
                headers: {
                    "app-token": APP_TOKEN,
                    "extension-token": user.attributes.tokenCookies.eaetkn,
                    "user-token": user.attributes.tokenCookies.eautkn,
                    "accept": "application/json",
                    "version-ext": framework.extension.version
                }
            };
            $.ajax(settings).done(function (response) {
                console.log(response);

            }).error(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown);
            });
        }
    },

    /**
     *
     * @param pageInfo
     * @param user
     */
    getSimilarList: function (pageInfo, user) {
        return function () {
            let result = null;

            let settings = {
                async: false,
                crossDomain: true,
                url: ApiClient.similarList(),
                type: "POST",
                headers: {
                    "Accept": "application/json",
                    "app-token": APP_TOKEN,
                    "extension-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eaetkn ? user.attributes.tokenCookies.eaetkn : '',
                    "user-token": user.attributes.tokenCookies && user.attributes.tokenCookies.eautkn ? user.attributes.tokenCookies.eautkn : '',
                    "version-ext": framework.extension.version
                },
                data: JSON.stringify({pageInfo}),
                dataType: 'json',
                contentType: 'application/json'
            };

            $.ajax(settings).done(function (data) {
                result = data;
            });
            return result;
        }();
    },

    /**
     *
     * @param targetInfo
     * @returns {{}}
     */
    getDecodeNotes: function (targetInfo) {
        var decodeNotes = {};
        var resume = targetInfo.itemInfo.seller.resume;

        const GROUP_SCORE = 0;
        const GROUP_FEEDBACK = 1;
        const GROUP_AGE = 2;
        const GROUP_DESCRIPTION = 3;
        const GROUP_COMMUNICATION = 4;
        const GROUP_SHIPPING = 5;

        function getLevel(level) {
            var obj = {};
            switch (level) {
                case LEVEL_ERROR:
                    obj.color = LEVEL_ERROR_COLOR;
                    obj.status = LEVEL_ERROR_STATUS;
                    break;
                case LEVEL_WARNING:
                    obj.color = LEVEL_WARNING_COLOR;
                    obj.status = LEVEL_WARNING_STATUS;
                    break;
                case LEVEL_INFO:
                    obj.color = LEVEL_INFO_COLOR;
                    obj.status = LEVEL_INFO_STATUS;
                    break;
            }

            return obj;
        }

        function getScoreText(type, notesScore) {
            switch (type) {
                case 0:
                    notesScore.text = 'notificationPriceTypeScore1';
                    break;
                case 1:
                    notesScore.text = 'notificationPriceTypeScore2';
                    break;
                case 2:
                    notesScore.text = 'notificationPriceTypeScore3';
                    break;
                case 3:
                    notesScore.text = 'notificationPriceTypeScore4';
                    break;
            }
        }

        function getFeedbackText(type, notesFeedback) {
            switch (type) {
                case 4:
                    notesFeedback.text = 'notificationPriceTypeFeedback1';
                    break;
                case 5:
                    notesFeedback.text = 'notificationPriceTypeFeedback2';
                    break;
                case 6:
                    notesFeedback.text = 'notificationPriceTypeFeedback3';
                    break;
                case 7:
                    notesFeedback.text = 'notificationPriceTypeFeedback4';
                    break;
            }
        }

        function getAgeText(type, notesAge, year) {
            switch (type) {
                case 8:
                    notesAge.text = 'notificationPriceTypeAge1';
                    break;
                case 9:
                    notesAge.text = 'notificationPriceTypeAge2';
                    break;
                case 10:
                    notesAge.text = 'notificationPriceTypeAge3';
                    notesAge.textArg = year;
                    break;
            }
        }

        function getDescriptionText(type, notesDescription) {
            switch (type) {
                case 11:
                    notesDescription.text = 'notificationPriceTypeDescription1';
                    break;
                case 12:
                    notesDescription.text = 'notificationPriceTypeDescription2';
                    break;
                case 13:
                    notesDescription.text = 'notificationPriceTypeDescription3';
                    break;
                case 14:
                    notesDescription.text = 'notificationPriceTypeDescription4';
                    break;
                case 15:
                    notesDescription.text = 'notificationPriceTypeDescription5';
                    break;
            }
        }

        function getCommunicationText(type, notesCommunication) {
            switch (type) {
                case 16:
                    notesCommunication.text = 'notificationPriceTypeCommunication1';
                    break;
                case 17:
                    notesCommunication.text = 'notificationPriceTypeCommunication2';
                    break;
                case 18:
                    notesCommunication.text = 'notificationPriceTypeCommunication3';
                    break;
                case 19:
                    notesCommunication.text = 'notificationPriceTypeCommunication4';
                    break;
                case 20:
                    notesCommunication.text = 'notificationPriceTypeCommunication5';
                    break;
            }
        }

        function getShippingText(type, notesShipping) {
            switch (type) {
                case 21:
                    notesShipping.text = 'notificationPriceTypeShipping1';
                    break;
                case 22:
                    notesShipping.text = 'notificationPriceTypeShipping2';
                    break;
                case 23:
                    notesShipping.text = 'notificationPriceTypeShipping3';
                    break;
                case 24:
                    notesShipping.text = 'notificationPriceTypeShipping4';
                    break;
                case 25:
                    notesShipping.text = 'notificationPriceTypeShipping5';
                    break;
            }
        }

        let defaultNotes = {
            color: "",
            status: "",
            text: ""
        };

        var notesScore = defaultNotes;
        var notesFeedback = defaultNotes;
        var notesAge = defaultNotes;
        var notesDescription = defaultNotes;
        var notesCommunication = defaultNotes;
        var notesShipping = defaultNotes;

        _.each(resume.notes, function (item) {

            switch (item.group) {
                case GROUP_SCORE:
                    notesScore = getLevel(item.level);
                    getScoreText(item.type, notesScore);
                    decodeNotes = {
                        notesScore: notesScore
                    };
                    break;
                case GROUP_FEEDBACK:
                    notesFeedback = getLevel(item.level);
                    getFeedbackText(item.type, notesFeedback);
                    decodeNotes = {
                        notesFeedback: notesFeedback
                    };
                    break;
                case GROUP_AGE:
                    notesAge = getLevel(item.level);
                    var year = item.tokens[0].value;
                    getAgeText(item.type, notesAge, year);
                    decodeNotes = {
                        notesAge: notesAge
                    };
                    break;
                case GROUP_DESCRIPTION:
                    notesDescription = getLevel(item.level);
                    getDescriptionText(item.type, notesDescription);
                    decodeNotes = {
                        notesDescription: notesDescription
                    };
                    break;
                case GROUP_COMMUNICATION:
                    notesCommunication = getLevel(item.level);
                    getCommunicationText(item.type, notesCommunication);
                    decodeNotes = {
                        notesCommunication: notesCommunication
                    };
                    break;
                case GROUP_SHIPPING:
                    notesShipping = getLevel(item.level);
                    getShippingText(item.type, notesShipping);
                    decodeNotes = {
                        notesShipping: notesShipping
                    };
                    break;
            }
        });
        decodeNotes = {
            notesScore: notesScore,
            notesFeedback: notesFeedback,
            notesAge: notesAge,
            notesDescription: notesDescription,
            notesCommunication: notesCommunication,
            notesShipping: notesShipping
        };

        return decodeNotes;
    },

    /**
     *
     * @param targetInfo
     * @returns {{ItemDynamicSvg: {}}|*}
     */
    getDecodeItemDynamic: function (targetInfo) {
        var ItemDynamicSvg = {};
        switch (targetInfo.itemInfo.dynamic.type) {
            case TYPE_NO_CHANGE:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#1EB1FC" fill-rule="evenodd" d="M16.492 17.85a.747.747 0 0 1-1.057-1.058l4.004-4.004H2.747a.747.747 0 0 1 0-1.495h16.709l-4.018-4.017a.747.747 0 0 1 1.058-1.057l5.285 5.285a.747.747 0 0 1 0 1.058l-5.289 5.287z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeNoChangeText';
                break;
            case TYPE_MINOR_DOWN:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#00C853" fill-rule="evenodd" d="M11.065 19.323a.747.747 0 0 1 0-1.495h5.662L4.924 6.025a.747.747 0 0 1 1.057-1.057l11.815 11.814v-5.681a.747.747 0 0 1 1.495 0v7.475a.747.747 0 0 1-.748.747h-7.478z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeMinorDownText';
                break;
            case TYPE_DOWN:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#00C853" fill-rule="evenodd" d="M6.185 16.527a.747.747 0 0 1 1.057-1.058l4.004 4.003V2.783a.747.747 0 0 1 1.495 0V19.49l4.018-4.018a.747.747 0 0 1 1.057 1.058l-5.285 5.285a.747.747 0 0 1-1.058 \t0l-5.287-5.288z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeDownText';
                break;
            case TYPE_MINOR_DOWN_AFTER_UP:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#00C853" fill-rule="evenodd" d="M11.711 8.829l7.016 6.999h-5.662a.747.747 0 1 0 0 1.495h7.478a.747.747 0 0 0 .748-.747V9.1a.747.747 0 0 0-1.495 0v5.681L12.355 7.36a.769.769 0 0 0-.069-.078c-.268-.268-.682-.29-.923-.048l-.08.08a.761.761 0 0 0-.032.032L3.045 15.55c-.241.242-.22.655.05.924.268.268.681.29.923.048L11.71 8.83z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeMinorAfterUpText';
                break;
            case TYPE_MINOR_UP_AFTER_DOWN:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#F44336" fill-rule="evenodd" d="M11.711 15.56l7.016-7h-5.662a.747.747 0 1 1 0-1.495h7.478c.413 0 .748.334.748.747v7.475a.747.747 0 0 1-1.495 0V9.606l-7.441 7.423a.769.769 0 0 1-.069.078c-.268.268-.682.29-.923.048l-.08-.08a.761.761 0 0 1-.032-.032L3.045 8.838c-.241-.242-.22-.655.05-.924.268-.268.681-.29.923-.048l7.693 7.693z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeMinorAfterDownText';
                break;
            case TYPE_UP:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#F44336" fill-rule="evenodd" d="M17.815 7.542a.747.747 0 0 1-1.057 1.057l-4.004-4.004v16.692a.747.747 0 0 1-1.495 0V4.578L7.242 8.596a.747.747 0 0 1-1.057-1.057l5.285-5.286a.747.747 0 0 1 1.058 0l5.287 5.289z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeUpText';
                break;
            case TYPE_MINOR_UP:
                ItemDynamicSvg.svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">\n' +
                    '<path fill="#F44336" fill-rule="evenodd" d="M19.289 12.97a.747.747 0 0 1-1.495 0V7.306L5.99 19.11a.747.747 0 0 1-1.057-1.057L16.748 6.238h-5.681a.747.747 0 0 1 0-1.495h7.475c.413 0 .747.335.747.748v7.478z"/>\n' +
                    '</svg>';
                ItemDynamicSvg.text = 'notificationPriceTypeMinorUpText';
                break;
        }

        return {
            ItemDynamicSvg
        };
    }
});

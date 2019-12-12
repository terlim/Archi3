(function () {
    window.startLoad = Date.now();
    _.delay(function () {
        (async function initContent() {
            if (typeof framework === "undefined") {
                _.delay(initContent, 1000);
            } else {
                let idHot;
                try {
                    idHot = parseInt(Utils.getProductId(Utils.getDomainPrice(location.host), location.pathname), 10);
                } catch (e) {
                }

                await Cookie.checkLocaleCookie();
                const i18nDataLocale = await Storage.syncGet('i18nDataLocale');
                $.i18n().locale = Object.keys(i18nDataLocale)[0];
                await $.i18n().load(i18nDataLocale);

                let userToken = '';
                framework.extension.fireEvent(GET_INFO_USER, {}, dataUser => {
                    if (dataUser) {
                        userToken = dataUser.token ? dataUser.token : '0';
                    }

                    if (dataUser.segments.includes('web.bd_be-127_aggregators1') ||
                        dataUser.segments.includes('web.bd_be-127_aggregators2')) {
                        initPriceAggHint(dataUser.segments.includes('web.bd_be-127_aggregators1'));
                    }

                    if (window.location.host.includes(ApiClient.domain) &&
                        window.location.pathname.endsWith('/user') &&
                        dataUser.segments.includes('web.bd_be-112_extlc')) {
                        initTeasers();
                    }
                });

                let searchLineCurrent = location.search;

                injectCSS();

                const showCashbackHints = await Storage.syncGet('showCashbackHints');
                if (typeof showCashbackHints === 'undefined' || showCashbackHints) {
                    $(document).ready(() => {
                        setNotificationSearch();
                    });
                }

                initDeliveryHint();

                framework.extension.fireEvent(SEND_THANKS_YOU_PAGE_DATA, {});

                let patternOwnerPage = null;

                try {
                    patternOwnerPage = location.href.matchAll(CHECK_LETYSHOPS)[0][0];
                } catch (e) {
                }

                Cookie.checkUserCookie();
                Cookie.checkMerchantCookie();
                Cookie.getMerchantCookie();
                Cookie.getTokensCookies();

                framework.extension.attachEvent(TAB_WAS_CHANGED, function (event) {
                        Cookie.checkMerchantCookie();
                    }
                );

                document.addEventListener(USER_APPLIED_LETY_CODES, function () {
                    framework.extension.fireEvent(UPDATE_LETY_CODES, {});
                });

                framework.extension.attachEvent(SEND_EXTENSION_INFO, function (event) {
                    if (patternOwnerPage) {
                        addMetaTags('LetyShops', framework.browser.name, event.data.version, location.href, patternOwnerPage);
                        Cookie.setCookie(COOKIE_EXTENSION_NAME, COOKIE_EXTENSION_VALUE, COOKIE_EXTENSION_EXPIRES, '.' + ApiClient.domain);
                    }
                });

                framework.extension.fireEvent(GET_EXTENSION_INFO, {tabId: null});

                framework.extension.fireEvent(SEND_PAGE_INFO, {
                    tabId: null,
                    data: {
                        referer: document.referrer,
                        url: document.location.href,
                        date: JSON.stringify(new Date())
                    }
                });

                if (location.href.match(patternOwnerPage)) {
                    var sci = document.cookie.match(new RegExp("(?:^|; )" + '_ga'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
                    if (sci) {
                        framework.extension.fireEvent(SEND_GA_CID, {tabId: null, data: decodeURIComponent(sci[1])});
                    }
                }

                Storage.get(location.origin, (dataLastTimeShow) => {
                    if (!dataLastTimeShow || _.now() - dataLastTimeShow > INTERVAL_SHOW_NOTIFICATION_MARKET) {

                        Storage.get('showSimilarList', (dataSimilarList) => {

                            if (dataSimilarList || typeof dataSimilarList === "undefined") {
                                _.delay(function () {

                                    function renderSimilar(dataSimilarList) {
                                        if (dataSimilarList && dataSimilarList.similarList && dataSimilarList.similarList.similarInfo) {

                                            if (Object.keys(dataSimilarList).length > 0 && dataSimilarList.arrMerchants.length > 0) {
                                                new NotificationSilimarList({model: dataSimilarList}).render();

                                                let productID = dataSimilarList.similarList.similarInfo.id.type + '_'
                                                    + dataSimilarList.similarList.similarInfo.id.id;
                                                let shopDomain = location.origin;

                                                framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                                    tabId: null,
                                                    data: {
                                                        type: 'pageview',
                                                        page: gaPageSimilarShow + productID + '/' + shopDomain + '/'
                                                    }
                                                });

                                                Storage.get('isSimilarOnboardingShown', function (isSimilarOnboardingShown) {
                                                    if (!isSimilarOnboardingShown) {
                                                        new NotificationSilimarOnboarding({
                                                            model: {
                                                                productID
                                                            }
                                                        }).render();

                                                        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                                            tabId: null,
                                                            data: {
                                                                type: 'pageview',
                                                                page: `/_recommendation/view/onboarding/${productID}/${shopDomain}/`
                                                            }
                                                        });

                                                        Storage.set('isSimilarOnboardingShown', true);
                                                    }
                                                });

                                                framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
                                                    {
                                                        tabId: null,
                                                        data: {
                                                            type: 'event',
                                                            category: 'Recommendation Show',
                                                            action: productID,
                                                            label: 'кол-во предложений',
                                                            value: dataSimilarList.arrMerchants.length
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    }

                                    Storage.get(location.href + '_user_' + userToken, (similarDataInfo) => {
                                        if (typeof similarDataInfo === "undefined" || !similarDataInfo.timeLastUpdated
                                            || _.now() - similarDataInfo.timeLastUpdated > UPDATE_INTERVAL_INFO_SIMILAR) {

                                            Storage.get(location.hostname, async (dataSimilarDomainInfo) => {
                                                if (typeof dataSimilarDomainInfo === "undefined" || (dataSimilarDomainInfo.settingsQuery.code === 0
                                                    || dataSimilarDomainInfo.settingsQuery.code === 1
                                                    && _.now() - dataSimilarDomainInfo.timeExpire > (dataSimilarDomainInfo.settingsQuery.expire * 1000))) {

                                                    const result = await ProductPageDetector.check();
                                                    if (!result) {
                                                        return;
                                                    }

                                                    framework.extension.fireEvent(NOTIFICATION_GET_SIMILAR_LIST, {
                                                        tabId: null,
                                                        data: await ProductPageDetector.getAdditionalParams()
                                                    }, function (dataSimilarList) {
                                                        dataSimilarList.timeLastUpdated = _.now();
                                                        if (dataSimilarList.similarList && dataSimilarList.similarList.settingsQuery.expire) {
                                                            let dataSimilarDomainInfo = {
                                                                timeExpire: _.now(),
                                                                settingsQuery: dataSimilarList.similarList.settingsQuery
                                                            };
                                                            Storage.set(location.hostname, dataSimilarDomainInfo);
                                                        }
                                                        Storage.set(location.href + '_user_' + userToken, dataSimilarList);
                                                        renderSimilar(dataSimilarList);
                                                    });
                                                }
                                            });

                                        } else {
                                            similarDataInfo.cache = true;
                                            renderSimilar(similarDataInfo);
                                        }
                                    });
                                }, 100);
                            }
                        });
                    }
                });

                _.delay(async function () {
                    let id, domainPrice, language;

                    try {
                        domainPrice = Utils.getDomainPrice(location.host);
                        id = Utils.getProductId(domainPrice, location.pathname);
                        language = await Storage.syncGet('locale');
                    } catch (e) {
                    }

                    if (id && id.length) {
                        const data = Utils.getPrice(domainPrice);
                        data.id = id;
                        data.region = Utils.getRegion(domainPrice);

                        framework.extension.fireEvent(NOTIFICATION_GET_PRICE, {
                            tabId: null,
                            data
                        }, async data => {
                            if (data && data.targetInfo && data.targetInfo.itemInfo && data.targetInfo.itemInfo.dynamic) {
                                const model = data;
                                model.language = language.split('_')[0];

                                new NotificationPrice({model}).render();
                                framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                    tabId: null,
                                    data: {
                                        type: 'pageview',
                                        page: gaPrefixMonitor + 'show/' + data.merchant.title + '/'
                                    }
                                });
                            }
                        });
                    }
                }, 200);

                _.delay(function () {
                    framework.extension.fireEvent(NOTIFICATION_GET_INFO, {tabId: null}, function (data) {
                        if (data) {
                            var merchant = data;
                            var tab = data.extendedTab;
                        }

                        if (merchant && tab && verificationWindow()) {
                            if (merchant && (!merchant.isSuppressed
                                || (!merchant.isActivated && merchant.settings.injectNotificationCart
                                    && new URL(window.location.href).pathname.startsWith(merchant.cartPage)))) {
                                var notification;
                                if (merchant.isActivated && merchant.settings.injectSuccessNotification) {
                                    if (checkNotificationContainer()) {
                                        if (merchant.hasPromoActivated) {
                                            new NotificationPromo({model: merchant, promo: data.promo}).render();
                                            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                                tabId: null,
                                                data: {
                                                    type: 'pageview',
                                                    page: gaPagePopup + 'activate-cashback-sale-done/' + merchant.title + '/'
                                                }
                                            });
                                        } else {
                                            if (merchant.isActivated && !idHot && !merchant.hot
                                                || merchant.isActivated && merchant.hot && !merchant.hot['hot_' + idHot].isActivatedHotProduct) {
                                                notification = new NotificationActivated({model: merchant}).render();
                                                if (!!merchant.hotProducts && merchant.hotProducts.length > 0) {
                                                    try {
                                                        var damainPriceActivate = Utils.getDomainPrice(location.host);
                                                        var idActivate = Utils.getProductId(damainPriceActivate, location.pathname);
                                                    } catch (e) {
                                                    }

                                                    if (idActivate && idActivate.length > 0) {
                                                        _.each(merchant.hotProducts, function (item) {
                                                            if (Object.keys(item).includes(idActivate)) {
                                                                notification.addRateForHotProduct(item);
                                                            }
                                                        });
                                                    }
                                                }
                                                framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                                    tabId: null,
                                                    data: {
                                                        type: 'pageview',
                                                        page: gaPagePopup + 'activate-cashback-done/' + merchant.title + '/'
                                                    }
                                                });
                                                framework.extension.fireEvent(SEND_ACTIVATION_DATA, {
                                                    tabId: null,
                                                    data: {
                                                        tab: tab,
                                                        merchant: merchant
                                                    }
                                                });
                                            } else if (merchant.isActivated && merchant.hot['hot_' + idHot].isActivatedHotProduct && !merchant.isSuppressed) {
                                                framework.extension.fireEvent(NOTIFICATION_DISMISS, {
                                                    tabId: null,
                                                    data: merchant.id
                                                });
                                            }
                                        }
                                    }
                                } else if (!merchant.isActivated && merchant.settings.injectNotification) {
                                    if (checkNotificationContainer()) {
                                        notification = new Notification({model: merchant}).render();
                                        if (merchant.checkUrlParams.length > 0) {
                                            notification.addInfo();
                                        }
                                        if (merchant.rewrite === true) {

                                            if (!!merchant.hotProducts) {

                                                try {
                                                    var damainPriceRewrite = Utils.getDomainPrice(location.host);
                                                    var idRewrite = Utils.getProductId(damainPriceRewrite, location.pathname);
                                                } catch (e) {
                                                }

                                                if (idRewrite && idRewrite.length > 0) {
                                                    var hotProductsArr = [];
                                                    _.each(merchant.hotProducts, function (item) {
                                                        if (Object.keys(item).includes(idRewrite)) {
                                                            notification.addWarningHotProduct(item);
                                                        } else {
                                                            hotProductsArr.push(item);
                                                        }
                                                    });
                                                    framework.extension.fireEvent(UPDATE_MERCHANTS_HOT_PRODUCTS, {
                                                        data: {
                                                            hotProductsArr: hotProductsArr,
                                                            id: merchant.id
                                                        }
                                                    });
                                                }

                                            } else {
                                                notification.addWarning();
                                            }

                                            // notification.addWarning();
                                            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                                tabId: null,
                                                data: {
                                                    type: 'pageview',
                                                    page: gaPagePopup + 'activate-cashback-reactivate/' + merchant.title + '/'
                                                }
                                            });
                                            framework.extension.fireEvent(SAW_REWRITE, {
                                                tabId: null,
                                                data: {id: merchant.id}
                                            });
                                        } else {
                                            framework.extension.fireEvent(CLEAR_COOKIES, {
                                                tabId: null,
                                                data: {merchant: merchant}
                                            });
                                            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                                tabId: null,
                                                data: {
                                                    type: 'pageview',
                                                    page: gaPagePopup + 'activate-cashback/' + merchant.title + '/'
                                                }
                                            });
                                        }
                                    }
                                } else if (!merchant.isActivated && merchant.settings.injectRewriteNotification &&
                                    merchant.rewrite === true && merchant.checkUrlParams.length > 0) {

                                    if (checkNotificationContainer()) {
                                        notification = new Notification({model: merchant}).render();
                                        notification.addInfo();
                                        notification.addWarning();

                                        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                            tabId: null,
                                            data: {
                                                type: 'pageview',
                                                page: gaPagePopup + 'activate-cashback-reactivate/' + merchant.title + '/'
                                            }
                                        });
                                        framework.extension.fireEvent(SAW_REWRITE, {
                                            tabId: null,
                                            data: {id: merchant.id}
                                        });
                                    }

                                } else if (!merchant.isActivated && merchant.settings.injectNotificationWithoutActivate) {

                                    new NotificationWithoutActivate({model: merchant}).render();

                                    framework.extension.fireEvent(SAW_REWRITE, {
                                        tabId: null,
                                        data: {id: merchant.id}
                                    });
                                }

                                if (parseFloat(($('.letyshops-notification-merchant-default').text()).replace(/\D+/g, "")) ===
                                    parseFloat(($('.letyshops-notification-merchant-rebate').find('span').text()).replace(/\D+/g, ""))) {
                                    $('.letyshops-notification-merchant-default').hide()
                                }
                            }
                        }
                    });
                }, 2000);

                var oldHref = document.location.href;
                _.delay(function () {
                    watchHref();
                }, 2000);

                framework.extension.attachEvent(CLOSE_ALL_NOTIFICATION, function (event) {
                    if (location.host.indexOf(event.data.pattern) > -1) {
                        $('body #letyshops-notification-container').fadeOut(400);
                    }
                });

                function verificationWindow() {
                    if ($(window).width() < 700) return false;
                    if (framework.browser.name === 'Chrome') {
                        if (location.href.indexOf('http') === 0 && (window.locationbar && window.locationbar.visible) || !window.locationbar) {
                            return true;
                        }
                    } else if ((window.menubar && window.menubar.visible) || !window.menubar) {
                        return true;
                    }
                    return false;
                }

                function checkNotificationContainer() {
                    return $('#letyshops-notification-container').css('display') === 'none' || "undefined" === typeof $('#letyshops-notification-container').css('display');
                }

                function initDeliveryHint() {
                    const url = new URL(document.location.href);

                    if (url.host === 'trade.aliexpress.com' && (url.pathname === '/orderList.htm' || url.pathname === '/order_list.htm')) {
                        const $cache = {
                            document: $(document),
                        };

                        framework.extension.attachEvent(RETURN_ALIEXPRESS_ORDERS, (response) => {
                            const $order = $cache.document.find(`td[orderid=${response.data}]`);

                            new CashbackHint({element: $order}).render();

                            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                tabId: null,
                                data: {
                                    type: 'event',
                                    category: 'Motivation Show',
                                    action: response.data,
                                    label: 'aliexpress',
                                    value: $cache.document.find('td[orderid').index($order) + 1
                                }
                            });

                            $order.find('[button_action=confirmOrderReceived]').on('click', function () {
                                framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                                    tabId: null,
                                    data: {
                                        type: 'event',
                                        category: 'Motivation Click',
                                        action: response.data,
                                        label: 'aliexpress',
                                        value: $cache.document.find('td[orderid').index($order) + 1
                                    }
                                });
                            });
                        });

                        const ordersForCheck = [];

                        $cache.document.find('#buyer-ordertable').find('.order-item-wraper').each(function () {
                            const $order = $(this);
                            const $logisticButton = $order.find('.button-logisticsTracking');
                            const $orderConfirmButton = $order.find('.button-confirmOrderReceived');

                            if ($logisticButton.length && $orderConfirmButton.length) {
                                ordersForCheck.push($logisticButton.attr('orderid'))
                            }
                        });

                        if (ordersForCheck.length) {
                            framework.extension.fireEvent(GET_ALIEXPRESS_ORDERS, {
                                tabId: null,
                                data: ordersForCheck
                            });
                        }
                    }
                }

                function initTeasers() {
                    const $container = $('.b-balance-info');

                    framework.extension.fireEvent(GET_RECOMMENDATIONS, {
                        tabId: null,
                        data: {}
                    }, (merchants) => {
                        new NotificationTeaser({
                            element: $container,
                            merchants
                        }).render();
                    });
                }

                function elementLoaded(el, cb) {
                    if ($(el).length) {
                        cb($(el));
                    } else {
                        setTimeout(function() {
                            elementLoaded(el, cb)
                        }, 500);
                    }
                }

                function initPriceAggHint(test1) {
                    const $productPage = $('#page-product');

                    if (window.location.host === 'hotline.ua' && $productPage.length) {
                        elementLoaded('#js-price-sort', function () {
                            $productPage.find('.offers-item').each(function (i, offer) {
                                const $offer = $(offer);
                                const id = $offer.find('[data-save-referer-card]').attr('href').match(/\d+/)[0];

                                if (HOTLINE_SHOPS[id]) {
                                    framework.extension.fireEvent(GET_MERCHANT_BY_ID, {
                                        data: {
                                            merchant_id: HOTLINE_SHOPS[id]
                                        }
                                    }, (data = {}) => {
                                        const merchant = data.merchant;
                                        if (merchant) {
                                            new NotificationAggregator({
                                                test1,
                                                model: merchant,
                                                element: $offer.find('.price-box .cell-7'),
                                                link: $($offer.find('[data-price-link]')).eq(0).attr('href')
                                            }).render();
                                        }
                                    });
                                }
                            })
                        });

                        $productPage.on('click', '.letyshops-notify-aggregator', function (e) {
                            e.preventDefault();

                            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
                                {
                                    tabId: null,
                                    data: {
                                        type: 'event',
                                        category: 'PriceAggregator',
                                        action: 'ShowButtonPriceAgr',
                                        label: 'hotline.ua',
                                    }
                                }
                            );

                            framework.extension.fireEvent(GET_RESPONSE_URL, {
                                tabId: null,
                                data: {
                                    url: `https://hotline.ua/${$(e.target).attr('href')}`
                                }
                            }, redirectUrl =>
                                window.open('https://letyshops.com/view/'+$(e.target).data().merchantId + '?' + redirectUrl + '&utm_campaign=notification_price_agr_hotline', '_blank'))
                        })
                    }
                }

                function setNotificationSearch() {
                    var searchUrls = [];
                    var $currentPageIndex;

                    if (!$('.letyshops-notification-search__icon').length) {

                        if (location.host.startsWith('www.yandex') || location.host.startsWith('yandex')) {
                            $currentPageIndex = $('.pager__item_current_yes');

                            _.each($('li.serp-item div.organic__subtitle'), function (item) {
                                if ($(item).find('span').length < 4) {
                                    if (!$(item).text().includes('реклама')) {
                                        // searchUrls.push(item.children[0])
                                        searchUrls.push($(item.children[0]).find('b')[0])
                                    }
                                }
                            });

                            document.body.addEventListener("DOMSubtreeModified", function () {
                                var searchLineModifyed = location.search;
                                if ($('.letyshops-notification-search__icon').length === 0 && searchLineModifyed !== searchLineCurrent) {
                                    searchLineCurrent = searchLineModifyed;
                                    setTimeout(function () {
                                        setNotificationSearch();
                                    }, 1000);
                                }
                            });

                        } else if (location.host.startsWith('www.google') || location.host.startsWith('google')) {
                            searchUrls = $('#search cite');
                            $currentPageIndex = $('#foot .cur');
                        }

                        _.each(searchUrls, (item, index) => {
                            const searchUrl = (!$(item).text().startsWith('http') ? location.protocol + '//' : '') + $(item).text();

                            framework.extension.fireEvent(GET_INFO_MERCHANT, {
                                data: {
                                    dataUrlPage: searchUrl.match(REG_URL)[0],
                                    firstShow: index === 0
                                }
                            }, (data = {}) => {
                                const merchant = data.merchant;
                                const firstShow = data.firstShow;

                                if (!merchant) {
                                    return;
                                }

                                const position = (parseInt($currentPageIndex.text(), 10) - 1) * 10 + (index + 1);
                                const urlParams = new URL(location.href).searchParams,
                                    query = urlParams.get('q') || urlParams.get('text');

                                const branded = merchant.aliases.reduce((prev, alias) =>
                                    prev + (decodeURIComponent(query).toLocaleLowerCase().indexOf(alias.toLowerCase()) + 1), 0);

                                if (merchant.settings.showInSearchEngine && (merchant.settings.dontShowInformer ? !branded : true)) {
                                    let $element = $(item).closest('div[data-hveid]');
                                    if (!$element.length) {
                                        $element = $(item).closest('.serp-item');
                                    }


                                    setTimeout(() => {
                                        if (!$element.find('#letyshops-notification-container-search').length) {
                                            new NotificationSearch({
                                                model: merchant,
                                                element: $element,
                                                show: firstShow,
                                                position
                                            }).render();
                                        }
                                    }, 0)
                                }
                            });
                        });
                    }
                }

                function addMetaTags(name, browserName, extensionVersion, local, pattern) {
                    if (local.match(pattern)) {
                        $('<meta/>', {
                            name: name,
                            type: browserName,
                            version: extensionVersion
                        }).appendTo('head');
                    }
                }

                function watchHref() {
                    let bodyList = document.querySelector("body"),
                        observer = new MutationObserver(function(mutations) {

                            mutations.forEach(function() {

                                if (oldHref !== document.location.href) {
                                    oldHref = document.location.href;
                                    framework.extension.fireEvent(GET_TOKEN_COOKIES, {
                                        tabId: null
                                    });
                                }
                            });
                        });

                    let config = {
                        childList: true,
                        subtree: true
                    };
                    observer.observe(bodyList, config);
                }
            }
        })();
    }, 200);
}());

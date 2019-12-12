var Merchants = Backbone.Collection.extend({
    model: Merchant,
    flag: "merchants",
    flagRates: "merchantsRates",

    updateFlag: "merchantsLastUpdated",
    updateFlagRates: 'merchantsLastUpdated',

    url: ApiClient.merchants(),

    initialize: function () {
        var self = this;

        self.on("reset", function () {
            self.save();
        });
        self.fetch();
    },

    resetAll: function () {
        var self = this;
        _.each(self.models, function (merchant) {
            merchant.unset('bonus');
            merchant.unset('userCashback');
            _.each(merchant.get('conditionsFormated'), function (value) {
                value.currentRateFormated = value.rateFormated;
                value.currentRate = value.rate;
            });
            merchant.reset();
        });
    },

    toJSON: function (models) {
        if (models && models.length > 0) {
            return _.map(models, function (model) {
                    return model && model.toJSON();
                }
            );
        } else {
            if (this.models && this.models.length > 0) {
                return _.map(this.models, function (model) {
                        return model && model.toJSON();
                    }
                );
            } else {
                return null;
            }
        }
    },

    setPersonalCashback: function (rates) {
        var self = this;

        if (rates && rates[0] && _.isArray(rates[0])) {
            rates = rates[0];
        }
        if (self.models.length === 0) {
            return;
        }

        var flag = true;
        _.each(self.models, function (merchant) {
            if (!merchant.get('rate') && merchant.get('rate') !== 0) {
                flag = false;
            }
        });

        if (!flag) {
            self.fetchRates();
            setTimeout(_.bind(function () {
                self.setPersonalCashback(rates);
            }, self), 100);

        } else {
            if (rates && rates.length) {
                rates.sort(function (a, b) {
                    return b.bonus - a.bonus;
                });

                var listShopsExclude = [];
                _.each(rates, function (code) {
                    if ("undefined" === typeof code.exclude_shop_ids) {
                        return true;
                    } else if (!code.exclude_shop_ids) {
                        listShopsExclude.push(code);
                    }
                });

                rates = rates.filter(function (i) {
                    return listShopsExclude.indexOf(i) < 0;
                });

                _.each(self.models, function (merchant) {
                    if (rates && rates.length > 0) {
                        _.each(rates, function (code) {
                            if ("undefined" === typeof code.exclude_shop_ids) {
                                if (merchant && (!merchant.get('bonus') || code.bonus > merchant.get('bonus'))) {
                                    self.countPersonalCashback(merchant, code);
                                }
                            } else if (code.exclude_shop_ids) {
                                _.each(code.shop_ids, function (id) {
                                    if (merchant && merchant.id !== parseInt(id) &&
                                        (!merchant.get('bonus') || code.bonus > merchant.get('bonus'))) {
                                        self.countPersonalCashback(merchant, code);
                                    }
                                });
                            }
                        });
                    } else {
                        merchant.unset('bonus');
                        merchant.set({userCashback: merchant.get('cashback')});
                        _.each(merchant.get('conditionsFormated'), function (value) {
                            value.currentRateFormated = value.rateFormated;
                            value.currentRate = value.rate;
                        });
                    }
                });

                _.each(listShopsExclude, function (code) {
                    _.each(code.shop_ids, function (id) {
                        var merchant = self.selectById(id);
                        if (merchant && (!merchant.get('bonus') || code.bonus > merchant.get('bonus'))) {
                            self.countPersonalCashback(merchant, code);
                        }
                    });
                })
            }
        }
    },

    countPersonalCashback: function (merchant, code) {
        if (merchant.get('conditionsFormated') && merchant.get('conditionsFormated').length > 0) {
            _.each(merchant.get('conditionsFormated'), function (value) {
                value.currentRate = ((+value.rate) * (((+code.bonus) + 100) / 100)).toFixed(2);
                value.currentRateFormated = ((+value.currentRate * 100) / 100) + '' + value.suffix;
            });
        }

        var cashback = ((+merchant.get('rate')) * (((+code.bonus) + 100) / 100)).toFixed(2);
        var formatted = ((+cashback * 100) / 100) + '' + merchant.get('suffix');
        merchant.set({
            userCashback: formatted,
            bonus: code.bonus,
            lastTimeCountPersonalCashback: _.now()
        });
    },

    setFavorites: function (ids) {
        var self = this;
        if (self.models.length === 0) {
            return;
        }
        _.each(self.models, (merchant) => merchant.set("isFavorite", ids && ids.includes(+merchant.get('id'))));

        try {
            self.trigger(POPUP_MERCHANTS_UPDATE);
        } catch (e) {
        }
    },

    setRecommended: function (ids) {
        var self = this;
        if (self.models.length === 0) {
            return;
        }
        _.each(self.models, (merchant) => merchant.set("isRecommended", ids && ids.includes(+merchant.get('id'))));

        try {
            self.trigger(POPUP_MERCHANTS_UPDATE);
        } catch (e) {
        }
    },

    setViewed: function (ids) {
        var self = this;
        if (self.models.length === 0) {
            return;
        }
        _.each(self.models, (merchant) => merchant.set("isViewed", ids && ids.includes(+merchant.get('id'))));

        try {
            self.trigger(POPUP_MERCHANTS_UPDATE);
        } catch (e) {
        }
    },

    save: function () {
        Storage.set(this.flag, this.toJSON());
    },

    /**
     *
     * @param self
     * @param _callee
     * @param _arguments
     */
    getMerchantsFromStorage: function (self, _callee, _arguments) {
        Storage.get(self.flag, function (merchants) {
            if (_.isNull(merchants) || _.isUndefined(merchants)) {
                self.reset([]);
                return;
            }
            if (merchants && _.isString(merchants)) {
                merchants = JSON.parse(merchants);
            }
            if (_.isObject(merchants)) {
                self.reset(merchants);
            } else if (!merchants) {
                Storage.set(self.updateFlag, 0);
                _callee.apply(self, _arguments);
            }
        });
    },

    /**
     *
     * @param self
     * @param _success
     * @param _callee
     * @param _arguments
     * @param arguments
     */
    setFetchSuccessMerchantObject: function (self, _success, _callee, _arguments, arguments) {
        Storage.set(self.updateFlag, _.now());
        if (_.isArray(arguments[1]) && _.has(arguments[1][0], 'id')) {
            _success && _success.apply(self, arguments);
        } else {
            self.getMerchantsFromStorage(self, _callee, _arguments);
        }
    },

    fetch: async function () {
        if (!arguments[0]) {
            arguments[0] = {};
            arguments.length = 1;
        }
        let self = this;
        let _arguments = arguments;
        let _options = arguments[0];
        let _callee = arguments.callee;

        const locale = await Storage.syncGet('locale');
        self.url = ApiClient.merchants() + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY));

        Storage.get(self.updateFlag, function (timeLastUpdated) {
                if (!timeLastUpdated || _.now() - timeLastUpdated > UPDATE_INTERVAL_MERCHANT) {

                    let _success = _options.success;
                    let _error = _options.error;
                    _options.success = function () {
                        self.setFetchSuccessMerchantObject(self, _success, _callee, _arguments, arguments);
                    };
                    _options.error = function () {
                        self.getMerchantsFromStorage(self, _callee, _arguments);
                    };
                    _options.reset = true;
                    Backbone.Collection.prototype.fetch.apply(self, _arguments).always(function () {
                        _options.success = _success;
                        _options.error = _error;
                    });
                } else {
                    self.getMerchantsFromStorage(self, _callee, _arguments);
                }
                if (!!self.fetchTimeout) {
                    clearTimeout(self.fetchTimeout);
                }
                self.fetchTimeout = setTimeout(function () {
                    _callee.apply(self, _arguments);
                }, UPDATE_INTERVAL_MERCHANT);
            }
        );
    },

    fetchForce: async function () {

        if (!arguments[0]) {
            arguments[0] = {};
            arguments.length = 1;
        }
        let self = this;
        let _arguments = arguments;
        let _options = arguments[0];
        let _callee = arguments.callee;
        let _success = _options.success;
        let _error = _options.error;

        const locale = await Storage.syncGet('locale');
        self.url = ApiClient.merchants() + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY));

        _options.success = function () {
            self.setFetchSuccessMerchantObject(self, _success, _callee, _arguments, arguments);
        };
        _options.error = function () {
            self.getMerchantsFromStorage(self, _callee, _arguments);
        };
        _options.reset = true;
        await Backbone.Collection.prototype.fetch.apply(self, _arguments).always(async function () {
            _options.success = await _success;
            _options.error = await _error;
        });
    },

    fetchRates: function (force) {
        var self = this;
        Storage.get(self.updateFlagRates, function (updateFlagRates) {
            if (!updateFlagRates || _.now() - updateFlagRates > UPDATE_INTERVAL_MERCHANT || force) {
                $.ajax({
                        url: ApiClient.cashRates(),
                        type: "get",
                        success: function (data) {
                            self.addRates(data);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR, textStatus, errorThrown);
                            self.addRates(self.models);
                        }
                    }
                );
            } else {
                Storage.get(self.flagRates, function (data) {
                    self.addRates(data);
                });

            }
        });

    },

    fetchUserCashbackRates: async function (merchant) {

        const locale = await Storage.syncGet('locale');
        const url = ApiClient.userCashbackRates(merchant.id) + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY));

        let self = this;
        merchant.set({
            lastTimeCountPersonalCashback: _.now()
        });
        let settings = {
            "async": false,
            "crossDomain": true,
            "url": url,
            "method": "GET"
        };
        $.ajax(settings).done(function (response) {
            let data = [];
            data.push(response);
            self.addRates(data);
        });
    },


    addRates: function (data) {
        var self = this;
        _.each(data, function (rate) {
            var merchant = self.findWhere({id: rate.id});
            if (merchant) {
                merchant.set({
                    rate: rate.a,
                    rate_formated: rate.b,
                    is_floating: rate.c,
                    suffix: rate.d,
                    type: rate.e,
                    conditionsFormated: rate.f,
                    cashback: rate.b,
                    rateUserCashback: !!rate.ac ? rate.ac : rate.a,
                    userCashback: !!rate.bc ? rate.bc : rate.b,
                    lastTimeCountPersonalCashback: _.now()
                });
                if (rate.c && rate.c > 0) {
                    merchant.set({cashbackFloated: true});
                }
            }

        });

        if (data) {
            Storage.set(self.updateFlagRates, _.now());
            Storage.set(self.flagRates, data);
        }
        self.ratesAdded = true;
        self.save();
    },

    parse: function (response) {
        response = _.filter(response, function (merchant) {
            return !!merchant.id && !!merchant.c;
        });

        return _.map(response, function (merchant) {
            return _.object(
                [
                    "id",
                    "title",
                    "aliases",
                    "thankyoupage",
                    "cashback",
                    "cashbackFloated",
                    "userCashback",
                    "domain",
                    "pattern",
                    "domains_enabled",
                    "domains_disabled",
                    "logo",
                    "shortDesc",
                    "longDesc",
                    "url",
                    "activateUrl",
                    "promo",
                    "checkUrlParams",
                    "checkCookieParams",
                    "countDomainLevel",
                    "settings",
                    "cashbackRate",
                    "rate",
                    "rate_formated",
                    "is_floating",
                    "suffix",
                    "type",
                    "conditionsFormated",
                    "cashback",
                    "userCashback",
                    "cashbackFloated",
                    "clickPageUrl",
                    "cartPage",
                    "disabledRedirect"
                ],
                [
                    merchant.id,
                    merchant.a,
                    merchant.h,
                    merchant.o,
                    merchant.i,
                    merchant.j,
                    merchant.i,
                    merchant.c,
                    merchant.c,
                    merchant.de,
                    merchant.dd,
                    merchant.d,
                    merchant.e,
                    merchant.f,
                    merchant.b,
                    merchant.m,
                    merchant.k,
                    merchant.l,
                    merchant.n,
                    merchant.c.match(/\./gi) != null ? merchant.c.match(/\./gi).length : 0,
                    _.isArray(merchant.g) ? _.object([
                        "globalDisabled",
                        "partnerList",
                        "partnerListNoActive",
                        "browserAction",
                        "injectNotification",
                        "injectNotificationWithoutActivate",
                        "injectSuccessNotification",
                        "injectRewriteNotification",
                        "showInSearchEngine",
                        "dontShowInformer",
                        "iconClickPage",
                        "showInSimilar",
                        "injectNotificationCart"
                    ], [
                        merchant.g.includes("global_disabled"),
                        merchant.g.includes("partner_list"),
                        merchant.g.includes("partner_list_noactive"),
                        merchant.g.includes("browser_action"),
                        merchant.g.includes("inject_notification"),
                        merchant.g.includes("inject_notification_without_activate"),
                        merchant.g.includes("inject_success_notification"),
                        merchant.g.includes("inject_rewrite_notification"),
                        merchant.g.includes("show_in_search_engine"),
                        merchant.g.includes("dont_show_informer"),
                        merchant.g.includes("icon_click_page"),
                        merchant.g.includes("show_in_similar"),
                        merchant.g.includes("inject_notification_cart")
                    ]) : {},
                    Object.keys(merchant.p).length > 0 ? _.object(
                        [
                            "rate",
                            "rateFormated",
                            "isFloating",
                            "suffixFormated",
                            "type",
                            "conditionsFormated"
                        ],
                        [
                            merchant.p.a,
                            merchant.p.b,
                            merchant.p.c,
                            merchant.p.d,
                            merchant.p.e,
                            merchant.p.f
                        ]) : {},
                    merchant.p.a,
                    merchant.p.b,
                    merchant.p.c,
                    merchant.p.d,
                    merchant.p.e,
                    merchant.p.f,
                    merchant.p.b,
                    merchant.p.b,
                    merchant.p.c && merchant.p.c > 0,
                    merchant.q,
                    merchant.r,
                    merchant.v
                ]);
        });
    },

    /*METHODS FOR SELECT BY CONDITION*/

    selectByDomain: function (domain) {
        let self = this;

        return self.find(function (item) {
            if (Array.isArray(item.get("domains_enabled")) && item.get("domains_enabled").length > 0
                && Array.isArray(item.get("domains_disabled")) && item.get("domains_disabled").length > 0) {

                let domainsEnabled = false;
                let domainsDisabled = false;
                let mainUrl = '';

                item.get("domains_enabled").find((url) => {
                    if (url.includes('*.') && domain.includes(url.replace('*.', '')) || domain === url) {
                        mainUrl = url.replace('*.', '');
                        domainsEnabled = true;
                        return 2;
                    }
                });

                item.get("domains_disabled").find((url) => {
                    if (url.includes('*.') && domain.includes(url.replace('*.', ''))) {
                        mainUrl = url.replace('*.', '');
                        domainsDisabled = true;
                        return 2;
                    }
                });

                if (domainsEnabled) {
                    item.get("domains_disabled").find((url) => {
                        if (domain === url && domain.includes(mainUrl)) {
                            domainsDisabled = false;
                            return 2;
                        } else {
                            if (domain.includes(mainUrl)) {
                                domainsDisabled = true;
                            }
                        }
                    });
                }

                if (!domainsDisabled) {
                    item.get("domains_enabled").find((url) => {
                        if (url === domain && domain.includes(mainUrl)) {
                            domainsEnabled = true;
                            return 2;
                        }
                    });
                }
                return domainsEnabled && domainsDisabled;

            } else {
                return domain === item.get('domain').replace('www.', '');
            }
        });
    },

    selectById: function (id) {
        var self = this;
        var merchant = self.findWhere({"id": +id});
        if (merchant) {
            if (merchant.get('settings').partnerList || merchant.get('settings').partnerListNoActive
                || merchant.get('settings').browserAction || merchant.get('settings').injectNotification
                || merchant.get('settings').injectSuccessNotification || merchant.get('settings').injectRewriteNotification
                || merchant.get('settings').iconClickPage) {
                return merchant;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    },

    getInfoForOffer: function (id) {
        var self = this;
        var merchant = self.findWhere({"id": +id});
        if (merchant && !merchant.get('settings').partnerList) {
            return {
                mId: merchant.get("id"),
                logo: merchant.get("logo"),
                cashback: merchant.get("userCashback") ? merchant.get("userCashback") : merchant.get("cashback"),
                cashbackFloated: merchant.get("cashbackFloated"),
                isFavorite: merchant.get("isFavorite"),
                url: merchant.get("url"),
                activateUrl: merchant.get("activateUrl")
            }
        }
        return null;
    },

    checkOfferMerchant: function (offers) {
        var self = this;
        var offersList = [];
        offers.forEach(function (item) {
            if (item.attributes.shopId) {
                var merchant = self.findWhere({"id": +item.attributes.shopId});
                if (merchant && merchant.get("settings").partnerList) {
                    offersList.push(item);
                }
            }
        });
        return offersList.length > 0 ? offersList : [];
    },

    selectFavorites: function () {
        var self = this;
        var favoritesList = [];
        self.where({"isFavorite": true}).forEach(function (item) {
            if (item.get('settings').partnerList || item.get('settings').partnerListNoActive) {
                favoritesList.push(item);
            }
        });
        return favoritesList.length > 0 ? self.toJSON(favoritesList) : [];
    },

    selectRecommended: function () {
        var self = this;
        var recommendedList = [];
        self.where({"isRecommended": true}).forEach(function (item) {
            if (item.get('settings').partnerList || item.get('settings').partnerListNoActive) {
                recommendedList.push(item);
            }
        });
        return recommendedList.length > 0 ? self.toJSON(recommendedList) : [];
    },

    selectViewed: function () {
        var self = this;
        var viewedList = [];
        self.where({"isViewed": true}).forEach(function (item) {
            if (item.get('settings').partnerList || item.get('settings').partnerListNoActive) {
                viewedList.push(item);
            }
        });
        return viewedList.length > 0 ? self.toJSON(viewedList) : [];
    },

    select50First: function (exceptIds) {
        var models = _.filter(this.models, function (merchant) {
            return merchant.get("settings").partnerList && !_.contains(exceptIds, merchant.id);
        });
        if (models && models.length) {
            if (models.length > 50) models.length = 50;
            return this.toJSON(models);
        } else {
            return null;
        }
    },

    selectByAlias: function (value) {
        var self = this;
        if (_.isString(value)) {
            let models = self.filter(merchant =>
                !merchant.get('settings').globalDisabled && merchant.get('aliases') && merchant.get('aliases').find(alias =>
                    alias.toLowerCase().includes(value.toLowerCase()))
            ) || [];

            if (models.length) {
                models = self.toJSON(models);
                models = _.sortBy(models, function (merchant) {
                    var orderIndex = 100;
                    _.each(merchant.aliases, function (alias) {
                        var currentIndex = alias.toLowerCase().indexOf(value.toLowerCase());
                        if (orderIndex > currentIndex && currentIndex !== -1) orderIndex = currentIndex;
                    });
                    return orderIndex;
                });

                models.splice(50);

                return models;
            }
        }
    }
});

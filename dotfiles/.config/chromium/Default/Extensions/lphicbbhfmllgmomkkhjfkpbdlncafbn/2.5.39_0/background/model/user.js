var User = Backbone.Model.extend({
    url: ApiClient.user(),
    updateFlag: "userLastAuthorization",
    timerUpdate: null,

    defaults: {
        "token": null,
        "name": "",
        "balanceInfo": [],
        "image": "https://image.letyshops.com/sites/default/files/pictures/ava-def.png",
        "partnerUrl": "",
        "partnerPercent": "",
        "rates": new Rates(),
        "notifications": [],
        "favorites": [],
        "recommended": [],
        "viewed": [],
        "language": "",
        "country": "",
        "segments": []
    },

    /**
     * create Object
     */
    initialize: function () {
        var self = this;
        self.rates = self.get("rates");
        framework.extension.attachEvent(ON_USER_LOGIN, function (event) {
            self.logIn(event.data.cookie);
        });
        framework.extension.attachEvent(ON_USER_LOGOUT, function (event) {
            self.logOut();
        });
        Storage.get(LOGIN_TOKEN, function (cookie) {
            if (cookie && cookie.length && typeof cookie === "string") {
                self.logIn(cookie);
            }
        });
        Storage.set(OFFLINE_LIKES, []);
    },

    /**
     *
     * @param self
     */
    setUpdated: function (self) {
        self.notifUpdated = false;
        self.userUpdated = false;
        self.notifUpdated = false;
        self.favUpdated = false;
        self.recomUpdated = false;
        self.viewUpdated = false;
        if (self.rates.codesUpdated) {
            self.rates.codesUpdated = false;
        }
    },

    /**
     * logIn user
     * @param cookie
     */
    logIn: async function (cookie) {
        let self = this;

        function fetchNotifyIntoLogin(forceUpdate = false) {
            self.fetchNotifications(forceUpdate, (value) => {
                self.set("notifications", value);
                if (_.findWhere(value, {status: "1"})) {
                    Button.setBadge(_.where(value, {status: "1"}).length);
                    framework.extension.fireEvent(SET_NOTIFICATIONS_POPUP, {tabId: null});
                    Storage.set(POPUP_FIRST_OPENING_TOKEN, "Wow!");
                } else {
                    Button.clearCounter();
                }
            });
        }

        if (!!cookie && cookie !== self.get("token")) {
            Storage.get(POPUP_FIRST_OPENING_TOKEN, function (token) {
                if (!token)
                    Button.setBadge("");
            });
            self.setUpdated(self);

            await self.fetch({
                success: async function (model, data) {
                    if (data.name) {
                        self.response = data;
                        self.set("token", cookie);
                        Storage.set(LOGIN_TOKEN, cookie);
                        const language = !!self.get('language') ? self.get('language') : 'ru';
                        const country = !!self.get('country') ? self.get('country') : DEFAULT_COUNTRY;
                        const locale = language + '_' + country;
                        const cacheLocale = await Storage.syncGet('locale');
                        Storage.set('locale', locale);
                        if (!cacheLocale || cacheLocale.split('_')[0] !== language || cacheLocale.split('_')[1] !== country) {
                            await framework.extension.fireEvent(LOAD_USER_LANGUAGE, {
                                tabId: null,
                                data: {language: language}
                            });
                        }
                        await framework.extension.fireEvent(REFRESH_ALL, {tabId: null});
                    } else {
                        self.set("token", null);
                        Storage.set(LOGIN_TOKEN, null);
                        self.logOut();
                    }
                }
            });

            clearInterval(self.mainInterval);


            self.mainInterval = await setInterval(_.bind(function () {
                fetchNotifyIntoLogin();
            }, self), 5 * 60 * 1000);


            if (!!cookie && cookie !== self.get("token")) {
                self.set("token", cookie);
                Storage.set(LOGIN_TOKEN, cookie);
            }
        }

        Storage.get(OFFLINE_LIKES, function (data) {
            _.each(data, function (id) {
                self.pushLiked(id)
            }, self);
        });

    },

    /**
     * logOut user
     */
    logOut: async function () {
        let self = this;
        if (self.get("token") !== null) {
            self.setUpdated(self);
            clearInterval(self.mainInterval);

            _.each(self.attributes, function (attributeVal, attributeName) {
                self.unset(attributeName);
            });
            Storage.set(LOGIN_TOKEN, null);

            if (!!self.timerUpdate) {
                window.clearTimeout(self.timerUpdate);
                self.timerUpdate = null;
            }
        }
    },

    /**
     * check login user
     */
    isLogin: function () {
        return this.get("token");
    },

    /**
     *FETCH COMMON USERS DATA
     */
    fetch: async function () {
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
        self.url = ApiClient.user() + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY));

        if (!self.userUpdated || _.now() - self.userUpdated > UPDATE_INTERVAL_USER) {
            self.userUpdated = _.now();
            Backbone.Model.prototype.fetch.apply(self, _arguments);
        }
    },

    /**
     * fetch Notifications user
     * @param forceUpdate
     * @param callback
     * @param force
     */
    fetchNotifications: async function (forceUpdate, callback, force) {
        let self = this;

        const locale = await Storage.syncGet('locale');
        const url = await (ApiClient.notifications() + '?locale=' + locale);

        if (!self.notifUpdated || _.now() - self.notifUpdated > UPDATE_INTERVAL_USER_NOTIFICATION || force) {
            self.notifUpdated = _.now();
            await $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    self.notifUpdated = _.now();

                    if (data && data.length > 0) {
                        let value = _.map(data, function (notification) {
                            return {
                                "id": notification.id + "",
                                "status": notification.status,
                                "markup": notification.markup,
                                "showed": parseInt(notification.status) === 1,
                                "date": notification.date,
                                "url": notification.url
                            }
                        });
                        callback && callback(value);
                    } else {
                        callback && callback([]);
                    }
                },
                error: function (jqXHR) {
                    if ('403' === jqXHR.status || "Forbidden" === jqXHR.statusText) {
                        framework.extension.log("fetchNotify - Forbidden");
                    }
                }
            });
        }

        if (forceUpdate) {
            _.delay(_.bind(self.fetchNotifications, self), UPDATE_INTERVAL_USER_NOTIFICATION, true, callback);
        }

    },

    /**
     * push Reviewed Notifications by user
     * @param id
     */
    pushReviewedNotifications: function (id) {
        var self = this;
        var notifications = self.get("notifications");
        var certainNotify = _.findWhere(notifications, {id: id + ""});
        if (certainNotify) {
            $.ajax({
                    url: ApiClient.notifications(),
                    type: "POST",
                    data: {"notification_ids": [id]},
                    processData: true,
                    success: function (data) {
                        if (!!data) {
                            self.fetchNotifications(true, function (value) {
                                self.set("notifications", value);
                                if (_.findWhere(value, {status: "1"})) {
                                    Button.setBadge(_.where(value, {status: "1"}).length);
                                } else {
                                    Button.clearCounter();
                                }
                            }, true);
                        }
                    },
                    error: function (jqXHR) {
                        if (jqXHR.status === '400' || jqXHR.statusText === "Bad Request") {
                            framework.extension.log("pushNotify - Forbidden");
                        }
                    }
                }
            );
        }
    },


    pushLiked: function (id) {
        var self = this;
        $.ajax({
                url: ApiClient.favoriteMerchants(),
                type: "POST",
                data: {
                    "shops_liked": [
                        {
                            "shop_id": id + "",
                            "date": self.currentDate()
                        }
                    ]
                },
                processData: true,
                success: function (data) {
                    if (data && (data.numInserted > 0 || data.numUpdated > 0)) {
                        if (data.numInserted > 0) {
                            framework.extension.log(data + ", " + data.numInserted + ", " + data.numUpdated);
                        }
                    }
                },
                error: function (jqXHR) {
                    if (jqXHR.status === '400' || jqXHR.statusText === "Bad Request") {
                        framework.extension.log("pushLiked - ​Missing parameters");
                    } else if (jqXHR.status === '403') {
                        framework.extension.log("pushLiked -  ​Access Denied");
                        Storage.get(OFFLINE_LIKES, function (data) {
                            data.push(id);
                            Storage.set(OFFLINE_LIKES, data);
                        });
                    }
                }
            }
        );
    },

    pushDisliked: function (id) {
        var self = this;
        $.ajax({
                url: ApiClient.deleteFavoriteMerchant(),
                type: "POST",
                data: {"shops_disliked": [id + ""]},
                processData: true,
                success: function (data) {
                    if (data && data.numUpdated > 0) {
                        if (data.numDeleted > 0) {
                            framework.extension.log(data + ", " + data.numDeleted);
                        }
                    }
                },
                error: function (jqXHR) {
                    if (jqXHR.status === '400' || jqXHR.statusText === "Bad Request") {
                        framework.extension.log("pushDisliked - ​Missing parameters");
                    } else if (jqXHR.status === '403') {
                        framework.extension.log("pushDisliked -  ​Access Denied");
                        Storage.get(OFFLINE_LIKES, function (data) {
                            var dislikeIndex = data.indexOf(id);
                            if (dislikeIndex > -1) {
                                data.splice(dislikeIndex, 1);
                                Storage.set(OFFLINE_LIKES, data);
                            }
                        });
                    }
                }
            }
        );
    },

    rewriteViewed: function (id) {
        var self = this;
        var data = [];
        if ($.inArray(id, self.get("viewed")) === -1) {
            _.each(self.get("viewed"), function (result, key) {
                if (key === 0) {
                    data[0] = id;
                    data[key + 1] = result;
                } else if (self.get("viewed").length === key + 1) {
                    return;
                } else {
                    data[key + 1] = result;
                }
            });
            self.set("viewed", data);
            Storage.set('viewedMerchants', data);
        }
    },

    //TODO: Доделать отправку просмотреных магазинов
    pushViewedMerchant: function (id) {
        var self = this;
        //post
        // $.ajax({
        //         url: ApiClient.visitedMerchants(),
        //         type: "POST",
        //         data: {
        //             "shops_viewed": [
        //                 {
        //                     "shop_id": id + "",
        //                     "date": self.currentDate()
        //                 }
        //             ]
        //         },
        //         processData: true,
        //         success: function (data, textStatus) {
        //             if (data && data.numInserted > 0) {
        //                 framework.extension.log(data + ", " + data.numInserted);
        //                 _.delay(_.bind(self.fetchViewed, self), 10000, false, function (value) {
        //                     self.set("viewed", value);
        //                 });
        //             }
        //         },
        //         error: function (jqXHR, textStatus, errorThrown) {
        //             if (jqXHR.status == '400' || jqXHR.statusText == "Bad Request") {
        //                 framework.extension.log("pushViewedMerchant - Forbidden");
        //             }
        //         }
        //     }
        // );
    },

    /**
     * PARSE common request
     * @param rawResponse
     * @returns {*}
     */
    parse: function (rawResponse) {
        return _.object(
            [
                "name",
                "balanceInfo",
                "image",
                "partnerUrl",
                "partnerPercent",
                "viewed",
                "favorites",
                "recommended",
                "language",
                "country",
                "segments"
            ],
            [
                rawResponse.name,
                !!rawResponse && rawResponse.balance_info
                && Object.keys(rawResponse.balance_info).length > 0
                    ? _.object(
                    [
                        "balanceApproved",
                        "balancePending",
                        "currency",
                        "currencyFormatted"
                    ],
                    [
                        rawResponse.balance_info.balance_approved,
                        rawResponse.balance_info.balance_pending,
                        rawResponse.balance_info.currency,
                        rawResponse.balance_info.currency_formatted,
                    ]) : [],
                rawResponse.image,
                rawResponse.partner_url,
                rawResponse.partner_percent,
                rawResponse.shops_viewed,
                rawResponse.shops_liked,
                rawResponse.shops_recomended,
                rawResponse.language,
                rawResponse.country,
                rawResponse.segments
            ]
        )
    },

    /**
     * current Date
     * @returns {string}
     */
    currentDate: function () {
        return new Date().toISOString();
    }
});

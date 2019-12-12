var NotificationSilimarList = BackboneContent.View.extend({
    id: "letyshops-notification-container-similar-list",
    template: Handlebars.templates.notification_similar_list,
    events: {
        "click .letyshops__similar-closebutton": "close",
        "click .letyshops__similar-collapse": "collapse",
        "click .letyshops__similar-settings": "toSettings",
        "click .letyshops__similar-shop": 'clickToMerchant',
        "click .letyshops__similar-close-ok": 'dismiss',
        "click .letyshops__similar-close-cancel": "hideClose",
        "click .letyshops__similar-minify-toogle": "minify",
        "click .letyshops__similar-js-toggle-sort": "toggleSort",
        "click .letyshops__similar-sort-item": "reSort"
    },

    initialize: function (options) {
        var self = this;
        self.options = options;
        self.loadedAt = window.startLoad || Date.now();
        self.model.sorts = [
            'Popularity',
            'Cashback',
            'HigherPrice',
            'LowerPrice'
        ];
        self.model.activeSort = self.model.sorts[0];
    },

    delegateEvents: function () {
        return BackboneContent.View.prototype.delegateEvents.apply(this, arguments);
    },

    hideClose() {
        this.close();
        this.letyToolsEvent('similar_hide');
    },

    toggleSort() {
        const self = this;
        const productID = self.model.similarList.similarInfo.id.type + '_' + self.model.similarList.similarInfo.id.id;
        const shopDomain = location.origin;
        const $sortBlock = this.$el.find('.letyshops__similar-sort-all');

        if (!$sortBlock.is(":visible")) {
            $(document.body).addClass('letyshops__hide-sort');
            $sortBlock.show(300);
            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                tabId: null,
                data: {
                    type: 'pageview',
                    page: `/_recommendation/view/sort/${productID}/${shopDomain}/`
                }
            });
        } else {
            $sortBlock.hide(300);
            $(document.body).removeClass('letyshops__hide-sort');
        }
    },

    minify() {
        const self = this;
        const productID = self.model.similarList.similarInfo.id.type + '_' + self.model.similarList.similarInfo.id.id;
        const shopDomain = location.origin;

        Storage.get('isSimilarMinified', isSimilarMinified => {
            framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                tabId: null,
                data: {
                    type: 'pageview',
                    page: gaPageSimilarShow + (!isSimilarMinified ? '/small-view' : 'large-view') + productID + '/' + shopDomain + '/'
                }
            });

            Storage.set('isSimilarMinified', !isSimilarMinified);
        });

        this.$el.toggleClass('letyshops__similar-minified');
    },

    close() {
        this.$el.removeClass('letyshops__similar-minified');
        $('.letyshops__similar').toggleClass('letyshops__similar-close');
    },

    reSort(e) {
        const self = this;
        const $target = $(e.target);
        const sort = $target.data().sort;
        const $renderedMerchants = this.$el.find(".letyshops__similar-list");
        const $currentSort = this.$el.find('.letyshops__similar-sort-current');
        const productID = self.model.similarList.similarInfo.id.type + '_' + self.model.similarList.similarInfo.id.id;
        const shopDomain = location.origin;

        Storage.set('similar_sort', sort);

        let items = $renderedMerchants.children();
        let byIdRecords = {};
        let action;

        self.model.arrMerchants.map(merchant => byIdRecords[merchant.id] = merchant);

        if (!self.originSort) {
            self.originSort = [...items];
        }

        switch (sort) {
            case 'Cashback':
                items.sort((a, b) => {
                    a = byIdRecords[$(a).data().merchant];
                    b = byIdRecords[$(b).data().merchant];

                    return parseFloat(a.userCashback || a.cashback)
                                > parseFloat(b.userCashback || b.cashback)
                                    ? -1 : 1;
                });

                action = 'Click On Big Cashback';

                break;
            case 'HigherPrice':
                items.sort((a, b) => {
                    a = byIdRecords[$(a).data().merchant];
                    b = byIdRecords[$(b).data().merchant];

                    return (parseFloat(a.price) || 0) > (parseFloat(b.price) || 0) ? -1 : 1;
                });

                action = 'Click On High Price';

                break;
            case 'LowerPrice':
                items.sort((a, b) => {
                    a = byIdRecords[$(a).data().merchant];
                    b = byIdRecords[$(b).data().merchant];

                    return (parseFloat(b.price) || 0) > (parseFloat(a.price) || 0) ? -1 : 1;
                });
                action = 'Click On Low Price';

                break;
            case 'Popularity':
                items = self.originSort;
                action = 'Click On Popular';

                break;
        }

        $(items).appendTo($renderedMerchants);

        const targetSortText = $target.text();
        const previousSortText = $currentSort.text();

        $target.text(previousSortText);
        $currentSort.text(targetSortText);

        $target.data('sort', $currentSort.data().sort);
        $currentSort.data('sort', sort);

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Recommendation Sort',
                    action,
                    label: productID,
                    value: shopDomain
                }
            }
        );

        this.$el.find('.letyshops__similar-sort-all').hide(300);
    },

    collapse: function() {
        const $container = $('.letyshops__similar');
        const $expandable = $('.letyshops__similar-expandable');

        if (!$container.hasClass('letyshops__similar-expanded')) {
            this.letyToolsEvent('similar_expand');

            if (this.model.arrMerchants.length > 6) {
                setTimeout(() => {
                    this.scollpane = $expandable.jScrollPane({
                        showArrows: false,
                        horizontalGutter: -2,
                        verticalGutter: 10,
                        mouseWheelSpeed: 5,
                        hideFocus: true
                    });
                }, 500);
            }
        } else {
            this.letyToolsEvent('similar_shrink');
            if (this.scollpane) {
                const api = this.scollpane.data('jsp');
                api.scrollTo(0, 0, 200);
                setTimeout(() => {
                    api.destroy();
                }, 300);
            }
        }

        $container.toggleClass('letyshops__similar-expanded');
    },

    toSettings: function () {
        this.letyToolsEvent('similar_settings');

        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else if (navigator.userAgent.indexOf(BROWSER_NAME_FF) !== -1) {
            framework.browser.navigate({
                url: chrome.runtime.getURL('options.html'),
                tabId: framework.browser.NEWTAB
            });
        } else {
            framework.browser.navigate({
                url: 'chrome://extensions/?options=' + chrome.runtime.id,
                tabId: framework.browser.NEWTAB
            });
        }

        const self = this;


        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS, {
            tabId: null,
            data: {
                    type: 'event',
                    category: 'Recommendation Settings',
                    action: self.model.similarList.similarInfo.id.type + '_' + self.model.similarList.similarInfo.id.id,
                    label: window.location.href
                }
            }
        );
    },

    clickToMerchant: function (e) {
        let self = this;
        const data = $(e.currentTarget).data();
        let productID = self.model.similarList.similarInfo.id.type + '_' + self.model.similarList.similarInfo.id.id;

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Recommendation Click',
                    action: productID,
                    label: data.name,
                    value: data.index + 1
                }
            }
        );

        this.letyToolsEvent('similar_click', {
            click_target_id: data.targetid.toString()
        });
    },

    dismiss: _.throttle(function () {
        let self = this;
        this.$el.fadeOut();
        Storage.set(location.origin, _.now());

        self.letyToolsEvent('similar_close');

        framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
            {
                tabId: null,
                data: {
                    type: 'event',
                    category: 'Recommendation Close',
                    action: self.model.similarList.similarInfo.id.type + '_' + self.model.similarList.similarInfo.id.id,
                    label: window.location.href
                }
            }
        );
    }, 1000),

    letyToolsEvent: function(name, params) {
        const data = params || {};
        data.url = window.location.href;
        data.time_after_page_load = Date.now() - this.loadedAt;
        data.target_id = this.model.similarList.similarInfo.id.id;

        framework.extension.fireEvent(SEND_LETYTOOL_EVENT, {
            tabId: null,
            data: {
                name,
                data
            }
        });
    },
    render: function () {
        if (!$.contains(window.document, this.el)) {
            Storage.get("isSimilarMinified", isSimilarMinified => {
                const self = this;
                const renderOptions = self.model;
                renderOptions.renderCollapse = renderOptions.arrMerchants.length > 5 && renderOptions.arrMerchants.length - 5;
                renderOptions.settingsActive = framework.browser.name !== BROWSER_NAME_SAFARI;
                renderOptions.renderTooltip =
                    renderOptions.similarList.similarInfo.nameShort !== renderOptions.similarList.similarInfo.name;

				self.$el.empty().append($(this.template(renderOptions)));
				self.$el.toggleClass('letyshops__similar-minified', !!isSimilarMinified);

                const styles = {
                    "position": "fixed",
                    "z-index": "2147483647",
                    "top": "10px",
                    "right": "10px",
                    "border": "0",
                    "padding": "0",
                    "display": "none"
                };

                document.body.parentNode.appendChild(self.el);

                self.$el.css(styles);

                Storage.get('similar_sort', (sort) => {
                    if (sort && sort !== 'Popularity') {
                        this.$el.find('[data-sort="'+sort+'"]').click();
                    }
                });

                self.$el.fadeIn(1000, function () {
                    _.defer(function () {
                        self.delegateEvents();

                        const targets = self.model.arrMerchants.map(merchant => merchant.targetId);

                        self.letyToolsEvent('similar_show', {
                            is_cache: !!renderOptions.cache,
                            target_list_show: targets.slice(0, 4),
                            target_list_hide: targets.slice(4),
                            target_list_skip: self.model.similarList.similarInfo.list.reduce((prev, current) => {
                                if (!targets.includes(current.id.id)) {
                                    prev.push(current.id.id.toString());
                                }

                                return prev;
                            }, [])
                        });
                    });
                });
            });
            
            $(document).on('click', '.letyshops__hide-sort', (e) => {
                const container = this.$el.find('.letyshops__similar-sort');

                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    this.$el.find('.letyshops__similar-sort-all').hide(300);
                    $(document.body).removeClass('letyshops__similar-sort');
                }
            });

            return this;
        }
    },
});
let Utils = (function () {
    let self = {};

    /**
     *
     * @param url
     * @returns {*|string}
     */
    self.getDomain = (url) => {
        return new URL(url).host.replace('www.', '');
    };

    /**
     *
     * @param element
     * @param cssProperty
     * @returns {*}
     */
    self.getStyle = (element, cssProperty) => {
        if (element.currentStyle) {
            return element.currentStyle[cssProperty];
        } else if (window.document.defaultView && window.document.defaultView.getComputedStyle) {
            var style = window.document.defaultView.getComputedStyle(element, '');
            return style ? style[cssProperty] : null;
        } else if (element.style) {
            return element.style[cssProperty];
        }
    };

    /**
     *
     * @returns {string}
     */
    self.guid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /**
     *
     * @returns {{browser: string, version: string, mobile: string, os: string, osversion: string, bit: string}}
     */
    self.getFullInfo = () => {
        var browser = '',
            version = '',
            mobile = '',
            os = '',
            osversion = '',
            bit = '',
            ua = window.navigator.userAgent || '',
            platform = window.navigator.platform || '';

        //Internet Explorer
        if (/MSIE/.test(ua)) {

            browser = 'Internet Explorer';

            if (/IEMobile/.test(ua)) {
                mobile = 1;
            }

            version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];


            //YaBrowser
        } else if (/YaBrowser/.test(ua)) {

            //Chromebooks
            if (/CrOS/.test(ua)) {
                platform = 'CrOS';
            }

            browser = 'YaBrowser';
            version = /YaBrowser\/[\d\.]+/.exec(ua)[0].split('/')[1];


            // Opera Browser
        } else if (/Opera/.test(ua) || /OPR/.test(ua)) {

            browser = 'Opera';
            version = /OPR\/[\d\.]+/.exec(ua)[0].split('/')[1];

            if (/mini/.test(ua) || /Mobile/.test(ua)) {
                mobile = 1;
            }

            // Chrome Browser
        } else if (/Chrome/.test(ua)) {

            //Chromebooks
            if (/CrOS/.test(ua)) {
                platform = 'CrOS';
            }

            browser = 'Chrome';
            version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];

            // Opera Browser
        } else if (/Android/.test(ua)) {

            browser = 'Android Webkit Browser';
            mobile = 1;
            os = /Android\s[\.\d]+/.exec(ua)[0];


            //Mozilla firefox
        } else if (/Firefox/.test(ua)) {

            browser = 'Firefox';

            if (/Fennec/.test(ua)) {
                mobile = 1;
            }
            version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];


            //Safari
        } else if (/Safari/.test(ua)) {

            browser = 'Safari';

            if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) {
                os = 'iOS';
                mobile = 1;
            }

        }

        if (!version) {

            version = /Version\/[\.\d]+/.exec(ua);

            if (version) {
                version = version[0].split('/')[1];
            } else {
                version = framework.browser.version;
            }

        }

        if (platform === 'MacIntel' || platform === 'MacPPC') {
            os = 'Mac OS X';
            osversion = ua.matchAll(/10[\.\_\d]+/gmi)[0][0];
            if (!!osversion) {
                osversion = osversion.split('_').join('.');
            }
        } else if (platform === 'CrOS') {
            os = 'ChromeOS';
        } else if (platform === 'Win32' || platform === 'Win64') {
            os = 'Windows';
            bit = platform.replace(/[^0-9]+/, '');
        } else if (!os && /Android/.test(ua)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        } else if (!os && /Windows/.test(ua)) {
            os = 'Windows';
        }

        return {
            browser: browser,
            version: version,
            mobile: mobile,
            os: os,
            osversion: osversion,
            bit: bit
        };
    };

    /**
     *
     * @param url
     */
    self.getAllUrlParams = (url) => {

        // извлекаем строку из URL или объекта window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // объект для хранения параметров
        var obj = {};

        // если есть строка запроса
        if (queryString) {

            // данные после знака # будут опущены
            queryString = queryString.split('#')[0];

            // разделяем параметры
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // разделяем параметр на ключ => значение
                var a = arr[i].split('=');

                // обработка данных вида: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // передача значения параметра ('true' если значение не задано)
                var paramValue = typeof (a[1]) === 'undefined' || a[1] === null ? '' : a[1];

                // преобразование регистра
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // если ключ параметра уже задан
                if (obj[paramName]) {
                    // преобразуем текущее значение в массив
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // если не задан индекс...
                    if (typeof paramNum === 'undefined') {
                        // помещаем значение в конец массива
                        obj[paramName].push(paramValue);
                    }
                    // если индекс задан...
                    else {
                        // размещаем элемент по заданному индексу
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                // если параметр не задан, делаем это вручную
                else {
                    obj[paramName] = paramValue;
                }
            }
        }

        return obj;
    };

    /**
     *
     * @param host
     * @returns {*}
     */
    self.getDomainPrice = (host) => {
        let domainPrice = null;
        if (host && host.length > 0) {
            if (host.indexOf('aliexpress') !== -1) {
                domainPrice = 'aliexpress';
            } else if (host.indexOf('gearbest') !== -1 && location.host.startsWith('www.gearbest')) {
                domainPrice = 'gearbest';
            } else if (host.indexOf('ru.gearbest') !== -1 && location.host.startsWith('ru.gearbest')) {
                domainPrice = 'ru.gearbest';
            } else if (host.indexOf('banggood') !== -1 && location.host.startsWith('www.banggood')) {
                domainPrice = 'banggood';
            } else if (host.indexOf('eu.banggood') !== -1 && location.host.startsWith('eu.banggood')) {
                domainPrice = 'eu.banggood';
            } else if (host.indexOf('us.banggood') !== -1 && location.host.startsWith('us.banggood')) {
                domainPrice = 'us.banggood';
            } else if (host.indexOf('lightinthebox') !== -1) {
                domainPrice = 'lightinthebox';
            } else if (host.indexOf('miniinthebox') !== -1) {
                domainPrice = 'miniinthebox';
            } else if (host.indexOf('tomtop') !== -1) {
                domainPrice = 'tomtop';
            }
        }
        return domainPrice;
    };

    /**
     *
     * @param domainPrice
     * @param pathname
     * @returns {*}
     */
    self.getProductId = (domainPrice, pathname) => {
        let id = null;
        if (domainPrice && domainPrice.length > 0) {
            switch (domainPrice) {
                case 'aliexpress':
                    id = pathname.matchAll(REGEX_ALI_PRODUCT_ID)[0][1];
                    id = id + '_aliexpress';
                    break;
                case 'gearbest':
                    id = pathname.matchAll(REGEX_GEARBEST_PRODUCT_ID)[0][1];
                    id = id + '_gearbest';
                    break;
                case 'ru.gearbest':
                    id = pathname.matchAll(REGEX_GEARBEST_PRODUCT_ID)[0][1];
                    id = id + '_ru_gearbest';
                    break;
                case 'banggood':
                    id = pathname.matchAll(REGEX_BANG_GOOD_PRODUCT_ID)[0][1];
                    id = id + '_banggood';
                    break;
                case 'eu.banggood':
                    id = pathname.matchAll(REGEX_BANG_GOOD_EU_PRODUCT_ID)[0][1];
                    id = id + '_eu_banggood';
                    break;
                case 'us.banggood':
                    id = pathname.matchAll(REGEX_BANG_GOOD_US_PRODUCT_ID)[0][1];
                    id = id + '_us_banggood';
                    break;
                case 'lightinthebox':
                    id = pathname.matchAll(REGEX_LIGHT_IN_THE_BOX_PRODUCT_ID)[0][1];
                    id = id + '_lightinthebox';
                    break;
                case 'miniinthebox':
                    id = pathname.matchAll(REGEX_LIGHT_IN_THE_BOX_PRODUCT_ID)[0][1];
                    id = id + '_miniinthebox';
                    break;
                case 'tomtop':
                    id = pathname.matchAll(REGEX_TOM_TOP_PRODUCT_ID)[0][1];
                    id = id + '_tomtop';
                    break;
            }
        }
        return id;
    };

    /**
     *
     * @returns {*}
     * @private
     */
    self._getTimeZoneOffset = () => {
        try {
            return new Date().toString().match(/([-\+][0-9]+)\s/)[1];
        } catch (e) {
            return null;
        }
    };

    /**
     *
     * @returns {*}
     * @private
     */
    self._getPriceGearbest = () => {
        try {
            var priceMin = $('#siteWrap').eq(0).find('script').html();
            priceMin = priceMin.matchAll(/window\.sessionStorage\.setItem.+gb_goodsInfo[.\s\S]+appPrice:\s*"([\d.]+)"[.\S\s]+;/gmi)[0][1];
            priceMin = parseFloat(parseFloat(priceMin).toFixed(2));
            var priceMax = priceMin;
            var currency = 'USD';

            if (!currency) {
                throw new Error('getPriceObj currency bad string');
            }
            if (priceMin > priceMax) {
                throw new Error('getPriceObj priceMin > priceMax');
            }
            if (!(priceMin > 0 && priceMax > 0)) {
                throw new Error('getPriceObj priceMin or priceMax less or equal 0');
            }

            var obj = self._getDisplayPriceGearBest();

            return {
                currency: currency,
                priceMin: priceMin,
                priceMax: priceMax,
                currencyDisplay: obj.currency,
                priceMinDisplay: obj.priceMin,
                priceMaxDisplay: obj.priceMax
            };
        } catch (e) {
            console.log('Error', e);
            return {
                currency: null,
                priceMin: null,
                priceMax: null,
                currencyDisplay: null,
                priceMinDisplay: null,
                priceMaxDisplay: null
            };
        }
    };

    /**
     *
     * @returns {*}
     * @private
     */
    self._getPriceBanggood = () => {
        try {
            let priceMin = parseFloat($('.item_box.price .now').attr('oriattrmin'));
            let price = parseFloat($('.item_box.price .now').attr('oriprice'));
            let priceMax = parseFloat($('.item_box.price .now').attr('oriattrmax'));
            let currency = null;
            let priceList = [];

            let matchObj = document.documentElement.innerHTML.match(/fb_jsonNewFB\s*=\s*(\{.+\}),/i);
            if (matchObj && matchObj.length === 2) {
                try {
                    let fbData = JSON.parse(matchObj[1]);
                    if (!price && fbData.value) {
                        price = parseFloat(fbData.value);
                        priceList.push(price);
                    }
                    if (fbData.currency) {
                        currency = fbData.currency;
                    }
                } catch (e) {
                }
            }
            matchObj = document.documentElement.innerHTML.match(/var\s+google_tag_params\s*=\s*{.+ecomm_totalvalue:(.+),\s*ecomm_pagetype:/i);
            if (matchObj && matchObj.length === 2) {
                try {
                    let glData = JSON.parse(matchObj[1]);

                    if (glData && typeof glData === 'number') {
                        priceList.push(glData);
                    } else if (typeof glData === 'object' && Array.isArray(glData)) {
                        priceList = priceList.concat(glData);
                    }
                } catch (e) {
                }
            }
            if (currency) currency = currency.toUpperCase().trim();

            if (!priceMin || price < priceMin) {
                priceMin = price;
            }
            if (!priceMax) {
                priceMax = priceMin;
            }

            for (let itemPrice of priceList) {
                if (priceMax < itemPrice) {
                    priceMax = itemPrice;
                } else if (itemPrice && priceMin > itemPrice) {
                    priceMin = itemPrice;
                }
            }

            $('.item_warehouse_list li[value!="US"] .item_warehouse_price').each(function () {
                if (parseFloat($(this).attr('oriprice')) < priceMin) { // important oriPrice => oriprice looks like bug in cheerio
                    priceMin = parseFloat($(this).attr('oriprice'));
                }

                if (parseFloat($(this).attr('oriprice')) > priceMax) {
                    priceMax = parseFloat($(this).attr('oriprice'));
                }
            });

            if (!currency) {
                throw new Error('getPriceObj currency bad string');
            }
            if (priceMin > priceMax) {
                throw new Error('getPriceObj priceMin > priceMax');
            }
            if (!(priceMin > 0 && priceMax > 0)) {
                throw new Error('getPriceObj priceMin or priceMax less or equal 0');
            }
            var obj = self._getDisplayPriceBanggood();

            return {
                currency: currency,
                priceMin: priceMin,
                priceMax: priceMax,
                currencyDisplay: obj.currency,
                priceMinDisplay: obj.priceMin,
                priceMaxDisplay: obj.priceMax
            };
        } catch (e) {
            console.log('Error', e);
            return {
                currency: null,
                priceMin: null,
                priceMax: null,
                currencyDisplay: null,
                priceMinDisplay: null,
                priceMaxDisplay: null
            };
        }
    };

    /**
     *
     * @returns {*}
     * @private
     */
    self._getPriceUsEuBanggood = () => {
        try {
            var priceMin = parseFloat($('.pro_price [itemprop="price"]').text());
            var priceMax = parseFloat($('.pro_price [itemprop="price"]').text());

            var currencyConfig = {
                'USD': 'US$',
                'EUR': '€',
                'GBP': '£',
                'AUD': 'AU$',
                'CAD': 'CA$',
                'RUB': 'руб.',
                'BRL': 'R$',
                'CHF': 'SFr',
                'DKK': 'Dkr',
                'PHP': '₱',
                'SGD': 'S$',
                'CZK': 'Kč',
                'HUF': 'Ft',
                'MXN': 'Mex$',
                'NOK': 'Kr',
                'NZD': 'NZD$',
                'PLN': 'zł',
                'THB': '฿',
                'HKD': 'HK$',
                'ILS': '₪',
                'SEK': 'Kr',
                'ZAR': 'R',
                'KRW': '₩',
                'CLP': '$',
                'TRY': 'TRY',
                'INR': 'Rs',
                'JPY': 'JPY',
                'AED': 'AED',
                'MYR': 'RM',
                'IDR': 'Rp',
                'UAH': '₴',
                'KWD': 'K.D.',
                'QAR': 'QR.',
                'BHD': 'BD.',
                'SAR': 'S.R.'
            };
            var currencyKeys = Object.keys(currencyConfig);
            var currencySign = $('.item_box.price .hbactive b').text();
            if (!currencySign) { // for eu and us
                currencySign = $('.pro_price .currency .currency_Prefix').text();
            }
            var currency;
            for (var i in currencyKeys) {
                if (currencyConfig[currencyKeys[i]] === currencySign) {
                    currency = currencyKeys[i];
                    break;
                }
            }

            if (!currency) {
                throw new Error('getPriceObj currency bad string');
            }
            if (priceMin > priceMax) {
                throw new Error('getPriceObj priceMin > priceMax');
            }
            if (!(priceMin > 0 && priceMax > 0)) {
                throw new Error('getPriceObj priceMin or priceMax less or equal 0');
            }

            var obj = self._getDisplayPriceBanggood();

            return {
                currency: currency,
                priceMin: priceMin,
                priceMax: priceMax,
                currencyDisplay: obj.currency,
                priceMinDisplay: obj.priceMin,
                priceMaxDisplay: obj.priceMax
            };
        } catch (e) {
            console.log('Error', e);
            return {
                currency: null,
                priceMin: null,
                priceMax: null,
                currencyDisplay: null,
                priceMinDisplay: null,
                priceMaxDisplay: null
            };
        }
    };

    /**
     *
     * @returns {{currency, priceMin, priceMax, currencyDisplay, priceMinDisplay, priceMaxDisplay}}
     * @private
     */
    self._getPriceLightinthebox = () => {

        function _getPriceMinLightinthebox(currency, priceText, itemId) {
            try {
                if (!currency) {
                    throw new Error('getPriceObjLightinthebox currency bad');
                }

                if (typeof priceText !== 'string') {
                    throw new Error('getPriceObjLightinthebox priceText not string');
                }

                /* eslint-disable */
                var currencyConfig = {
                    'USD': '.', 'EUR': '.', 'GBP': '.', 'CAD': '.', 'AUD': '.',
                    'CHF': '.', 'HKD': '.', 'JPY': '.', 'RUB': ',', 'BRL': ',',
                    'CLP': ',', 'NOK': ',', 'DKK': ',', 'SAR': '.', 'SEK': '.',
                    'KRW': '.', 'ILS': '.', 'MXN': '.', 'SGD': '.', 'NZD': '.',
                    'ARS': ',', 'INR': '.', 'COP': ',', 'AED': '.', 'CZK': '.',
                    'PLN': ',', 'CNY': '.', 'BHD': '.', 'OMR': '.', 'QAR': '.',
                    'KWD': '.', 'JOD': '.', 'EGP': '.'
                };
                /* eslint-enable */

                var decimal = currencyConfig[currency];
                if (decimal === null) {
                    throw new Error('getPriceObjLightinthebox can not decimal for this currency');
                }

                var regex = new RegExp('[^0-9' + decimal + ']', ['g']);
                return parseFloat(priceText.replace(regex, '').replace(/^\./gmi, '').replace(decimal, '.'));
            } catch (e) {
                console.log('getPriceObjLightinthebox error', {err: e, itemId: itemId});
                return null;
            }
        }

        function getPriceObjLightinthebox() {
            try {
                var currency = $('span[itemprop="priceCurrency"]').eq(0).attr('content').replace(/\s\s+/g, ' ').trim().toUpperCase();

                var prodInfoConfig = JSON.parse($('#_prodInfoConfig_').attr('data-config'));
                var targetSourceIdFromConfig = Object.keys(prodInfoConfig)[0];

                var priceMin = parseFloat(prodInfoConfig[targetSourceIdFromConfig]['salePrice']);
                var priceMax = priceMin;

                var attributes = prodInfoConfig[targetSourceIdFromConfig].attributes;

                for (var attr of attributes) {
                    for (var item of attr.items) {
                        if (item.price > 0) {
                            var possibleMaxPrice = parseFloat((priceMin + parseFloat(item.price)).toFixed(2));
                            if (possibleMaxPrice > priceMax) {
                                priceMax = possibleMaxPrice;
                            }
                        }
                    }
                }

                if (!currency) {
                    throw new Error('getPriceObjLightinthebox currency bad string');
                }
                if (priceMin > priceMax) {
                    throw new Error('getPriceObjLightinthebox priceMin > priceMax');
                }
                if (!(priceMin > 0 && priceMax > 0)) {
                    throw new Error('getPriceObjLightinthebox priceMin or priceMax less or equal 0');
                }
                return {
                    currency: currency,
                    priceMin: priceMin,
                    priceMax: priceMax,
                    currencyDisplay: currency,
                    priceMinDisplay: priceMin,
                    priceMaxDisplay: priceMax
                };
            } catch (e) {
                console.log('Error', e);
                return {
                    currency: null,
                    priceMin: null,
                    priceMax: null,
                    currencyDisplay: null,
                    priceMinDisplay: null,
                    priceMaxDisplay: null
                };
            }
        }

        return getPriceObjLightinthebox();
    };

    /**
     *
     * @param bodyText
     * @returns {*}
     * @private
     */
    self._getPriceTomtop = (bodyText) => {
        try {
            var product;
            try {
                product = JSON.parse(bodyText.matchAll(/var\s+product\s*=(.*)/gmi)[0][1]);
            } catch (e) {
                product = null;
            }
            var mainContent;
            try {
                mainContent = JSON.parse(bodyText.matchAll(/var\s+mainContent\s*=(.*)?;/gmi)[0][1]);
            } catch (e) {
                mainContent = null;
            }
            var timeLimit;
            try {
                timeLimit = JSON.parse(bodyText.matchAll(/var\s+timeLimit\s*=(.*)?;/gmi)[0][1]);
            } catch (e) {
                timeLimit = null;
            }
            var productPrice = product ? parseFloat(product.saleprice ? product.saleprice : product.price) : null;
            var productCurrency = product ? product.currency : null;
            var mainContentPrices = [];
            if (typeof mainContent === 'object' && mainContent && mainContent.length > 0) {
                mainContent.forEach(function (row) {
                    if (typeof row.whouse === 'object' && row.whouse) {
                        Object.keys(row.whouse).forEach(function (whouse) {
                            mainContentPrices.push({
                                listingId: row.listingId,
                                depotId: row.whouse[whouse].depotId,
                                symbol: row.whouse[whouse].symbol,
                                nowprice: parseFloat(row.whouse[whouse].nowprice),
                                origprice: parseFloat(row.whouse[whouse].origprice),
                                us_nowprice: parseFloat(row.whouse[whouse].us_nowprice),
                                us_origprice: parseFloat(row.whouse[whouse].us_origprice),
                                saleStartDate: row.whouse[whouse].saleStartDate,
                                saleEndDate: row.whouse[whouse].saleEndDate
                            });
                        });
                    }
                });
            }
            var timeLimitPrices = [];
            if (typeof timeLimit === 'object' && timeLimit) {
                Object.keys(timeLimit).forEach(function (sku) {
                    if (typeof timeLimit[sku] === 'object' && timeLimit[sku]) {
                        Object.keys(timeLimit[sku]).forEach(function (subRow) {
                            timeLimitPrices.push({
                                listingId: timeLimit[sku][subRow].listingId,
                                depotId: timeLimit[sku][subRow].depot,
                                actPrice: parseFloat(timeLimit[sku][subRow].actPrice),
                                nowprice: parseFloat(timeLimit[sku][subRow].nowprice)
                            });
                        });
                    }
                });
            }
            var currency = 'USD';
            var currencyDisplay = productCurrency;
            var priceMinArr = {};
            var priceMaxArr = {};
            var priceMinDisplayArr = {};
            var priceMaxDisplayArr = {};
            var hasTimeLimitsListingAndDepotIds = [];
            if (timeLimitPrices.length > 0) {
                timeLimitPrices.forEach(function (row) {
                    hasTimeLimitsListingAndDepotIds.push(row.depotId + '_' + row.listingId);
                    if (!priceMinArr[row.listingId]) priceMinArr[row.listingId] = row.actPrice;
                    if (!priceMaxArr[row.listingId]) priceMaxArr[row.listingId] = row.actPrice;
                    if (row.actPrice < priceMinArr[row.listingId]) priceMinArr[row.listingId] = row.actPrice;
                    if (row.actPrice > priceMaxArr[row.listingId]) priceMaxArr[row.listingId] = row.actPrice;
                    if (!priceMinDisplayArr[row.listingId]) priceMinDisplayArr[row.listingId] = row.nowprice;
                    if (!priceMaxDisplayArr[row.listingId]) priceMaxDisplayArr[row.listingId] = row.nowprice;
                    if (row.nowprice < priceMinDisplayArr[row.listingId]) priceMinDisplayArr[row.listingId] = row.nowprice;
                    if (row.nowprice > priceMaxDisplayArr[row.listingId]) priceMaxDisplayArr[row.listingId] = row.nowprice;
                });
            }
            if (mainContentPrices.length > 0) {
                mainContentPrices.forEach(function (row) {
                    if (hasTimeLimitsListingAndDepotIds.indexOf(row.depotId + '_' + row.listingId) !== -1) {
                        return 0; //continue
                    }
                    if (!priceMinArr[row.listingId]) priceMinArr[row.listingId] = row.us_nowprice;
                    if (!priceMaxArr[row.listingId]) priceMaxArr[row.listingId] = row.us_nowprice;
                    if (row.us_nowprice < priceMinArr[row.listingId]) priceMinArr[row.listingId] = row.us_nowprice;
                    if (row.us_nowprice > priceMaxArr[row.listingId]) priceMaxArr[row.listingId] = row.us_nowprice;
                    if (!priceMinDisplayArr[row.listingId]) priceMinDisplayArr[row.listingId] = row.nowprice;
                    if (!priceMaxDisplayArr[row.listingId]) priceMaxDisplayArr[row.listingId] = row.nowprice;
                    if (row.nowprice < priceMinDisplayArr[row.listingId]) priceMinDisplayArr[row.listingId] = row.nowprice;
                    if (row.nowprice > priceMaxDisplayArr[row.listingId]) priceMaxDisplayArr[row.listingId] = row.nowprice;
                });
            }
            var priceMin = null;
            var priceMax = null;
            var priceMinDisplay = null;
            var priceMaxDisplay = null;
            Object.keys(priceMinArr).forEach(function (listingId) {
                if (!priceMin) priceMin = priceMinArr[listingId];
                if (priceMinArr[listingId] < priceMin) priceMin = priceMinArr[listingId];
            });
            Object.keys(priceMaxArr).forEach(function (listingId) {
                if (!priceMax) priceMax = priceMaxArr[listingId];
                if (priceMaxArr[listingId] > priceMax) priceMax = priceMaxArr[listingId];
            });
            Object.keys(priceMinDisplayArr).forEach(function (listingId) {
                if (!priceMinDisplay) priceMinDisplay = priceMinDisplayArr[listingId];
                if (priceMinDisplayArr[listingId] < priceMinDisplay) priceMinDisplay = priceMinDisplayArr[listingId];
            });
            Object.keys(priceMaxDisplayArr).forEach(function (listingId) {
                if (!priceMaxDisplay) priceMaxDisplay = priceMaxDisplayArr[listingId];
                if (priceMaxDisplayArr[listingId] > priceMaxDisplay) priceMaxDisplay = priceMaxDisplayArr[listingId];
            });
            if (!priceMinDisplay) priceMinDisplay = productPrice;
            if (!priceMaxDisplay) priceMaxDisplay = productPrice;
            if (productPrice < priceMinDisplay) priceMinDisplay = productPrice;
            if (productPrice > priceMaxDisplay) priceMaxDisplay = productPrice;
            if (!currency) {
                throw new Error('getPriceObj currency bad string');
            }
            if (priceMin > priceMax) {
                throw new Error('getPriceObj priceMin > priceMax');
            }
            if (!(priceMin > 0 && priceMax > 0)) {
                throw new Error('getPriceObj priceMin or priceMax less or equal 0');
            }
            if (!currencyDisplay) {
                throw new Error('getPriceObj currencyDisplay bad string');
            }
            if (priceMinDisplay > priceMaxDisplay) {
                throw new Error('getPriceObj priceMinDisplay > priceMaxDisplay');
            }
            if (!(priceMinDisplay > 0 && priceMaxDisplay > 0)) {
                throw new Error('getPriceObj priceMinDisplay or priceMaxDisplay less or equal 0');
            }
            return {
                currency: currency,
                priceMin: priceMin,
                priceMax: priceMax,
                currencyDisplay: currencyDisplay,
                priceMinDisplay: priceMinDisplay,
                priceMaxDisplay: priceMaxDisplay
            };
        } catch (e) {
            console.error('Error', e);
            return {
                currency: null,
                priceMin: null,
                priceMax: null,
                currencyDisplay: null,
                priceMinDisplay: null,
                priceMaxDisplay: null
            };
        }
    };

    /**
     *
     * @returns {{currency, priceMin, priceMax}}
     */
    self._getDisplayPriceBanggood = () => {
        function _getPriceObj() {
            try {
                var currencyConfig = {
                    'USD': {label: 'US$', decimal: '.'},
                    'EUR': {label: '€', decimal: ','},
                    'GBP': {label: '£', decimal: '.'},
                    'AUD': {label: 'AU$', decimal: '.'},
                    'CAD': {label: 'CA$', decimal: '.'},
                    'RUB': {label: 'руб.', decimal: '.'}, // don't found decimal price
                    'BRL': {label: 'R$', decimal: ','},
                    'CHF': {label: 'SFr', decimal: '.'},
                    'DKK': {label: 'Dkr', decimal: '.'},
                    'PHP': {label: '₱', decimal: '.'},
                    'SGD': {label: 'S$', decimal: '.'},
                    'CZK': {label: 'Kč', decimal: '.'},
                    'HUF': {label: 'Ft', decimal: '.'}, // don't found decimal price
                    'MXN': {label: 'Mex$', decimal: '.'},
                    'NOK': {label: 'Kr', decimal: '.'},
                    'NZD': {label: 'NZD$', decimal: '.'},
                    'PLN': {label: 'zł', decimal: '.'},
                    'THB': {label: '฿', decimal: '.'},
                    'HKD': {label: 'HK$', decimal: '.'},
                    'ILS': {label: '₪', decimal: '.'},
                    'SEK': {label: 'Kr', decimal: '.'},
                    'ZAR': {label: 'R', decimal: '.'},
                    'KRW': {label: '₩', decimal: '.'}, // don't found decimal price
                    'CLP': {label: '$', decimal: '.'}, // don't found decimal price
                    'TRY': {label: 'TRY', decimal: '.'},
                    'INR': {label: 'Rs', decimal: '.'},
                    'JPY': {label: 'JPY', decimal: '.'}, // don't found decimal price
                    'AED': {label: 'AED', decimal: '.'},
                    'MYR': {label: 'RM', decimal: '.'},
                    'IDR': {label: 'Rp', decimal: '.'},
                    'UAH': {label: '₴', decimal: '.'},
                    'KWD': {label: 'K.D.', decimal: '.'},
                    'QAR': {label: 'QR.', decimal: '.'},
                    'BHD': {label: 'BD.', decimal: '.'},
                    'SAR': {label: 'S.R.', decimal: '.'},
                    'EGP': {label: 'E£', decimal: '.'},
                    'OMR': {label: 'RO.', decimal: '.'},
                    'JOD': {label: 'J.D.', decimal: '.'},
                    'LBP': {label: '￡L', decimal: '.'}
                };

                let parsePriceByCurrency = function (priceStr, currencyCode) {
                    let price;
                    priceStr = priceStr.split(' ').join('');
                    priceStr = priceStr.replace(currencyConfig[currencyCode].label, '');
                    var priceDevided = priceStr.split(currencyConfig[currencyCode].decimal);

                    if (priceDevided.length) {
                        priceDevided[0] = priceDevided[0].match(/\d+/gmi).join('');
                        if (priceDevided.length === 1) priceDevided.push('00');
                        price = priceDevided.join('.');
                    }
                    return price;
                };

                var currencySelectors = ['.item_box.price .hbactive b', '.pro_price .currency .currency_Prefix', '.item_currency .currency_sign strong em'];
                var currencySign;
                for (var selector of currencySelectors) {
                    var $currency = $(selector);
                    if ($currency.length) {
                        currencySign = $currency.text().trim();
                        break;
                    }
                }
                var currency = Object.keys(currencyConfig).find(key => currencyConfig[key]['label'] === currencySign);
                if (!currency) {
                    throw new Error('getPriceObj currency bad string');
                }

                var price;
                var $price = $('.item_box.price .now');
                if ($price.length) {
                    price = $price.text().split('~');
                } else {
                    // for site version=2
                    let priceBase = $('.item_price_box .item_now_price').text();
                    if (!priceBase.length) {
                        priceBase = $('.pro_price [itemprop="price"]').text();
                    }
                    if (priceBase.length) {
                        price = [priceBase, priceBase];
                    }
                }
                for (let key in price) {
                    price[key] = parsePriceByCurrency(price[key], currency);
                }
                var priceMin = parseFloat(price[0]);
                var priceMax = parseFloat(price[1]);

                if (!priceMin) { // for eu and us
                    priceMin = parseFloat($('.pro_price [itemprop="price"]').text());
                    priceMax = priceMin;
                }

                if (priceMin === 0) {
                    throw new Error('getPriceObj priceMin should be more than 0');
                }

                if (!priceMax) {
                    priceMax = priceMin;
                }
                $('.main_info .warehouse_box li .now_price').each(function (key, elem) {
                    let whPrice = $(elem).html();
                    if (whPrice) {
                        whPrice = parseFloat(parsePriceByCurrency(whPrice, currency));
                        if (priceMin > whPrice) priceMin = whPrice;
                        if (priceMax < whPrice) priceMax = whPrice;
                    }
                });

                $('.item_warehouse_list .item_warehouse_price').each(function () {
                    var priceWarehouse = parseFloat($(this).text().replace(/[,\s]/gmi, '').match(/\d+[.\d+]*/gmi)[0]);
                    if (priceWarehouse < priceMin) {
                        priceMin = priceWarehouse;
                    }
                    if (priceWarehouse > priceMax) {
                        priceMax = priceWarehouse;
                    }
                });

                if (priceMin > priceMax) {
                    throw new Error('getPriceObj priceMin > priceMax');
                }
                if (!(priceMin > 0 && priceMax > 0)) {
                    throw new Error('getPriceObj priceMin or priceMax less or equal 0');
                }
                return {currency: currency, priceMin: priceMin, priceMax: priceMax};
            } catch (e) {
                console.log('Error', e);
                return {currency: null, priceMin: null, priceMax: null};
            }
        }

        return _getPriceObj();
    };

    /**
     *
     * @returns {{currency, priceMin, priceMax}}
     */
    self._getDisplayPriceGearBest = () => {
        function _getPriceObj(priceText) {
            try {
                var currencyConfig = { // важен порядок в этом массиве
                    'AED': 'د.إ',
                    'AUD': 'AU$',
                    'BGN': 'лв',
                    'BRL': 'R$',
                    'CAD': 'C$',
                    'CHF': 'SFr.',
                    'CLP': 'CL$',
                    'CNY': '¥',
                    'COP': 'Col$',
                    'CZK': 'Kč',
                    'DKK': 'DKr.',
                    'EUR': '€',
                    'GBP': '£',
                    'HKD': 'HK$',
                    'HRK': 'Kn',
                    'HUF': 'Ft',
                    'IDR': 'Rp',
                    'ILS': '₪',
                    'INR': 'Rs',
                    'JPY': '円',
                    'KRW': '₩',
                    'MAD': 'د.م.',
                    'MXN': 'MXN$',
                    'MYR': 'RM',
                    'NGN': '₦',
                    'NOK': 'NKr.',
                    'NZD': 'NZ$',
                    'PEN': 'S/.',
                    'PLN': 'zł',
                    'RON': 'lei',
                    'RSD': 'РСД',
                    'RUB': 'руб.',
                    'SAR': 'ر.س',
                    'SEK': 'SKr',
                    'SGD': 'S$',
                    'THB': '฿',
                    'TRY': 'TL',
                    'TWD': 'NT$',
                    'UAH': '₴',
                    'USD': '$',
                    'ZAR': 'R'
                };
                var currencyKeys = Object.keys(currencyConfig);
                var currency;
                for (let i in currencyKeys) {
                    if (priceText.toLowerCase().indexOf(currencyConfig[currencyKeys[i]].toLowerCase()) !== -1) {
                        currency = currencyKeys[i];
                        break;
                    }
                }
                if (!currency) {
                    throw new Error('getPriceObj currency bad string');
                }

                if (typeof priceText !== 'string') {
                    throw new Error('getPriceObj priceText not string');
                }

                var priceMin = parseFloat(priceText.match(/\d+[.\d+]*/gmi)[0]);
                var priceMax = priceMin;

                if (priceMin > priceMax) {
                    throw new Error('getPriceObj priceMin > priceMax');
                }
                if (!(priceMin > 0 && priceMax > 0)) {
                    throw new Error('getPriceObj priceMin or priceMax less or equal 0');
                }
                return {currency: currency, priceMin: priceMin, priceMax: priceMax};
            } catch (e) {
                console.log('Error', e);
                return {currency: null, priceMin: null, priceMax: null};
            }
        }

        return _getPriceObj($('.goodsIntro_price').eq(0).text());
    };

    /**
     *
     * @param text
     * @returns {{priceMin: null, priceMax: null, currencyDisplay: *, currency: null, priceMaxDisplay: *, priceMinDisplay: *}|{priceMin: null, priceMax: null, currencyDisplay: null, currency: null, priceMaxDisplay: null, priceMinDisplay: null}|{priceMin: number, priceMax: number, currencyDisplay: *, currency: *, priceMaxDisplay: *, priceMinDisplay: *}}
     * @private
     */
    self._getPriceAliexpress = (text) => {
        try {
            let priceMin;
            let priceMax;
            let currency;

            let priceStr = self._getPriceStrAliexpress();

            try {
                priceMin = parseFloat(parseFloat(text.matchAll(REGEX_ACT_MIN_PRICE)[0][1]).toFixed(2));
            } catch (e) {
                priceMin = parseFloat(parseFloat(text.matchAll(REGEX_MIN_PRICE)[0][1]).toFixed(2));
            }

            try {
                priceMax = parseFloat(parseFloat(text.matchAll(REGEX_ACT_MAX_PRICE)[0][1]).toFixed(2));
            } catch (e) {
                priceMax = parseFloat(parseFloat(text.matchAll(REGEX_MAX_PRICE)[0][1]).toFixed(2));
            }

            currency = text.matchAll(REGEX_BASE_CURRENCY_CODE)[0][1];

            if (!currency) {
                throw new Error('getPriceObj currency bad string');
            }
            if (priceMin > priceMax) {
                throw new Error('getPriceObj priceMin > priceMax');
            }
            if (!(priceMin > 0 && priceMax > 0)) {
                throw new Error('getPriceObj priceMin or priceMax less or equal 0');
            }

            var obj = self._getDisplayPriceAliexpress(priceStr);

            return {
                currency: currency,
                priceMin: priceMin,
                priceMax: priceMax,
                currencyDisplay: obj.currency,
                priceMinDisplay: obj.priceMin,
                priceMaxDisplay: obj.priceMax
            };

        } catch (e) {

            try {
                let objGroup = self._getDisplayPriceAliexpress(priceStr);

                return {
                    currency: null,
                    priceMin: null,
                    priceMax: null,
                    currencyDisplay: objGroup.currency,
                    priceMinDisplay: objGroup.priceMin,
                    priceMaxDisplay: objGroup.priceMax
                };
            } catch (e) {
                console.log('Error', e);
                return {
                    currency: null,
                    priceMin: null,
                    priceMax: null,
                    currencyDisplay: null,
                    priceMinDisplay: null,
                    priceMaxDisplay: null
                };
            }
        }
    };

    /**
     *
     * @param priceText
     * @returns {*}
     */
    self._getDisplayPriceAliexpress = (priceText) => {
        try {
            if (typeof priceText !== 'string') {
                throw new Error('getPriceObj priceText not string');
            }

            var currencyConfig = [
                [/US.*\$/gmi, 'USD', '.'],
                [/руб\./gmi, 'RUB', ','],
                [/￡/gmi, 'GBP', '.'],
                [/R\$/gmi, 'BRL', ','],
                [/C\$/gmi, 'CAD', '.'],
                [/AU.*\$/gmi, 'AUD', '.'],
                [/€/gmi, 'EUR', ','],
                [/Rs\./gmi, 'INR', '.'],
                [/грн\./gmi, 'UAH', ','],
                [/￥/gmi, 'JPY', '.'], // decimal not found dot by default
                [/MXN\$/gmi, 'MXN', '.'],
                [/Rp/gmi, 'IDR', '.'],
                [/TL/gmi, 'TRY', '.'],
                [/SEK/gmi, 'SEK', '.'],
                [/CLP/gmi, 'CLP', '.'], // decimal not found dot by default
                [/₩/gmi, 'KRW', '.'], // decimal not found dot by default
                [/SG\$/gmi, 'SGD', '.'],
                [/NZ\$/gmi, 'NZD', '.'],
                [/CHF/gmi, 'CHF', '.'],
                [/zł/gmi, 'PLN', ',']
            ];

            var currency = null;
            var decimal = null;
            for (var i = 0; i < currencyConfig.length; i++) {
                var settingRow = currencyConfig[i];
                if (settingRow[0].test(priceText)) {
                    currency = settingRow[1];
                    decimal = settingRow[2];
                    priceText = priceText.replace(settingRow[0], '');
                    break;
                }
            }
            if (currency === null || decimal === null) {
                throw new Error('getPriceObj can not find currency (USD, RUB)');
            }

            var price = priceText.toLowerCase().match(/[\d.,-]+/gmi).join('').split('-');
            if (!price || !(price.length === 1 || price.length === 2) || !price[0]) {
                throw new Error('getPriceObj can not match');
            }

            // fix for tmall prices
            if (price[0].indexOf(',') !== -1 && price[0].indexOf('.') !== -1 && price[0].indexOf(',') < price[0].indexOf('.')) {
                decimal = '.';
            } else if (price[0].indexOf(',') === -1 && price[0].match(/\./gmi) && price[0].match(/\./gmi).length === 1) {
                decimal = '.';
            }

            var regex = new RegExp('[^0-9-' + decimal + ']', ['g']);

            var priceMin = parseFloat(price[0].replace(regex, '').replace(decimal, '.'));
            var priceMax = priceMin;
            if (price[1]) {
                priceMax = parseFloat(price[1].replace(regex, '').replace(decimal, '.'));
            }
            if (priceMin > priceMax) {
                throw new Error('getPriceObj priceMin > priceMax');
            }
            if (!(priceMin > 0 && priceMax > 0)) {
                throw new Error('getPriceObj priceMin or priceMax less or equal 0');
            }
            return {currency: currency, priceMin: priceMin, priceMax: priceMax};
        } catch (e) {
            console.log('Error', e);
            return {currency: null, priceMin: null, priceMax: null};
        }
    };

    /**
     *
     * @returns {*|jQuery}
     */
    self._getPriceStrAliexpress = () => {
        var priceStr = $('.product-multi-price-main #j-multi-currency-price, .product-multi-price-main span[itemprop="priceCurrency"]').text();
        if (!priceStr) {
            priceStr = $('.p-price-content .p-symbol, .p-price-content .p-price').text();
        }

        if (!priceStr) {
            priceStr = $('div.p-price span.p-price').text();
        }

        if (!priceStr) {
            priceStr = $('.detail-price-container .price-span').text();
        }
        return priceStr;
    };

    self._getPriceAliexpressNewDesign = (runParams) => {
        try {
            let priceMin = null;
            let priceMax = null;
            let currency;

            currency = self._getCurrencyPriceAliexpressNewDesign(runParams);

            let priceList = runParams.data.skuModule.skuPriceList;

            for (let i in priceList) {
                if (priceList[i] && priceList[i].skuVal) {
                    let priceFromJson = parseFloat(priceList[i].skuVal.actSkuCalPrice || priceList[i].skuVal.skuCalPrice);

                    if (priceMin === null || priceMin > priceFromJson) {
                        priceMin = priceFromJson;
                    }
                    if (priceMax === null || priceMax < priceFromJson) {
                        priceMax = priceFromJson;
                    }
                }
            }

            let obj = self._getDisplayPriceAliexpressNewDesign(runParams);

            return {
                currency: currency,
                priceMin: priceMin,
                priceMax: priceMax,
                currencyDisplay: obj.currency,
                priceMinDisplay: obj.priceMin,
                priceMaxDisplay: obj.priceMax
            };
        } catch (e) {
            try {
                let objGroup = self._getDisplayPriceAliexpressNewDesign(runParams);

                return {
                    currency: null,
                    priceMin: null,
                    priceMax: null,
                    currencyDisplay: objGroup.currency,
                    priceMinDisplay: objGroup.priceMin,
                    priceMaxDisplay: objGroup.priceMax
                };
            } catch (e) {
                console.log('Error', e);
                return {
                    currency: null,
                    priceMin: null,
                    priceMax: null,
                    currencyDisplay: null,
                    priceMinDisplay: null,
                    priceMaxDisplay: null
                };
            }
        }
    };

    /**
     *
     * @param runParams
     * @returns {string|null|*}
     * @private
     */
    self._getCurrencyPriceAliexpressNewDesign = (runParams) => {
        try {
            let skuVal = runParams.data.skuModule.skuPriceList[0].skuVal;
            let actSkuCalPrice = parseFloat(skuVal.actSkuCalPrice ? skuVal.actSkuCalPrice : skuVal.skuCalPrice);
            let skuAmount = skuVal.skuActivityAmount ? skuVal.skuActivityAmount : skuVal.skuAmount;
            let skuAmountValue = parseFloat(skuAmount.value);
            let skuAmountCurrency = skuAmount.currency;
            if (!(actSkuCalPrice > 0 && skuAmountValue > 0)) {
                throw new Error('Can not detect currency');
            }
            if (actSkuCalPrice === skuAmountValue) {
                return skuAmountCurrency;
            }
            let commonModule = runParams.data.commonModule;
            if (commonModule.tradeCurrencyCode !== commonModule.currencyCode) {
                return commonModule.tradeCurrencyCode
            }
            return 'USD';
        } catch (e) {
            return null;
        }
    };

    /**
     *
     * @param runParams
     * @returns {{priceMin: null, priceMax: null, currency: null}|{priceMin: *, priceMax: *, currency: *}}
     * @private
     */
    self._getDisplayPriceAliexpressNewDesign = (runParams) => {
        try {
            let priceModule = runParams.data.priceModule;
            return {
                currency: priceModule.minActivityAmount ? priceModule.minActivityAmount.currency : priceModule.minAmount.currency,
                priceMin: priceModule.minActivityAmount ? priceModule.minActivityAmount.value : priceModule.minAmount.value,
                priceMax: priceModule.maxActivityAmount ? priceModule.maxActivityAmount.value : priceModule.maxAmount.value
            };
        } catch (e) {
            return {currency: null, priceMin: null, priceMax: null};
        }
    };

    /**
     *
     * @returns {*|jQuery}
     * @private
     */
    self._getPriceStrAliexpressNewDesign = () => {
        var priceStr = $('.product-multi-price-main #j-multi-currency-price, .product-multi-price-main span[itemprop="priceCurrency"]').text();
        if (!priceStr) {
            priceStr = $('.p-price-content .p-symbol, .p-price-content .p-price').text();
        }

        if (!priceStr) {
            priceStr = $('div.p-price span.p-price').text();
        }

        if (!priceStr) {
            priceStr = $('.detail-price-container .price-span').text();
        }
        return priceStr;
    };

    /**
     *
     * @param text
     * @private
     */
    self._isNewDesign = (text) => {
        try {
            return JSON.parse(text.matchAll(/window\.runParams\s*=\s*({[.\s\S]+?});/gmi)[0][1]
                .split(' ').join('').split("\r").join("")
                .split("\n").join("")
                .replace('data', '\"data\"')
                .replace('csrfToken', '\"csrfToken\"')
                .replace('\:\'', '\:\"')
                .replace('\'\,', '\"')
                .replace('abVersion', ',\"abVersion\"')
                .replace('\:\'', '\:\"')
                .replace('\'\,', '\"'));
        } catch (e) {
            return false;
        }
    };

    /**
     *
     * @param domainPrice
     * @returns {{}}
     */
    self.getPrice = (domainPrice) => {
        let obj = {};
        if (domainPrice && domainPrice.length > 0) {
            switch (domainPrice) {
                case 'aliexpress':
                    let text = $('body').text();
                    let runParams = self._isNewDesign(text);
                    if (runParams) {
                        obj = self._getPriceAliexpressNewDesign(runParams);
                        break;
                    }
                    obj = self._getPriceAliexpress(text);
                    break;
                case 'gearbest':
                case 'ru.gearbest':
                    obj = self._getPriceGearbest();
                    break;
                case 'banggood':
                    obj = self._getPriceBanggood();
                    break;
                case 'us.banggood':
                case 'eu.banggood':
                    obj = self._getPriceUsEuBanggood();
                    break;
                case 'lightinthebox':
                case 'miniinthebox':
                    obj = self._getPriceLightinthebox();
                    break;
                case 'tomtop':
                    obj = self._getPriceTomtop($('body').text());
                    break;
            }
        }

        obj.timezone = self._getTimeZoneOffset();
        return obj;
    };

    /**
     *
     * @param host
     * @returns {string}
     */
    self.getRegion = (host) => {
        let region = '';

        if (host === 'aliexpress') {
            const text = $('body').text();

            const country = text.matchAll(REGEX_REGION_COUNTRY_NAME);
            const province = text.matchAll(REGEX_REGION_PROVINCE_NAME);
            const city = text.matchAll(REGEX_REGION_CITY_NAME);

            region = (country ? country[0][1] : 'UNKNOWN') + '_' +
                (province ? province[0][1] : 'UNKNOWN') + '_' +
                (city ? city[0][1] : 'UNKNOWN');
        }

        return region;
    };

    return self;
}());


/**
 *
 * @param regexp
 * @returns {null}
 */
String.prototype.matchAll = function (regexp) {
    let matches = [];
    this.replace(regexp, function () {
        let arr = ([]).slice.call(arguments, 0);
        let extras = arr.splice(-2);
        arr.index = extras[0];
        matches.push(arr);
    });
    return matches.length ? JSON.parse(JSON.stringify(matches)) : null;
};

/**
 *
 * @param size
 * @returns {string}
 */
Number.prototype.pad = function (size) {
    let a = String(this).substring(0, 1);
    let s = String(Math.abs(this));
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return a === '-' ? '+' + s + ':00' : '-' + s + ':00';
};

/**
 * Custom log
 */
function log() {
    if (DEBUG && console.info) {
        console.info.apply(null, arguments);
    }
}

/**
 * Custom warn
 */
function warn() {
    if (DEBUG && console.warn) {
        console.warn.apply(null, arguments);
    }
}

/**
 * Custom error
 */
function error() {
    if (DEBUG && console.error) {
        console.error.apply(null, arguments);
    }
}

/**
 * Has Permission Segments
 */
function hasPermissionSegments(permissions = [], segments = []) {
    if (Array.isArray(segments) && segments.length && Array.isArray(permissions) && permissions.length) {
        return segments.filter(segments => permissions.includes(segments)).length > 0;
    }
    return false;
}

(function () {
    if (!DEBUG) {
        window.console.log = () => {
        };
        window.console.warn = () => {
        };
    }
}());

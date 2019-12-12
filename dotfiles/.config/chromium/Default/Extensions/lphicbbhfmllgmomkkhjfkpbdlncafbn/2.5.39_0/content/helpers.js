Handlebars.registerHelper('pickNum', function () {
    if (arguments.length > 0 && arguments[0]) {
        try {
            var numChar = (parseFloat(arguments[0]) + "").length;
            return arguments[0].substring(0, numChar);
        } catch (e) {
            framework.extension.log("pickNum - " + arguments[0]);
            return arguments[0];
        }
    }
});

Handlebars.registerHelper('href', function () {
    let utm_campaign = arguments[0].isSuppressed ? 'notification_get_cashback_cart' : 'notification_get_cashback';

    if (arguments.length) {
        return ApiClient.getLink() + arguments[0].activateUrl + PARAMETER_DEEP_LINK + encodeURIComponent(window.location.origin) + encodeURIComponent(window.location.pathname) +
            '&utm_source=extension&utm_campaign=' + (typeof arguments[1] === 'string' ? arguments[1] : utm_campaign) + '&utm_term=' + Utils.getFullInfo().browser.toLowerCase();
    }
});

Handlebars.registerHelper('equals', function (state, opts) {
    if((ARRAY_MERCHANTS_PRICE_SELLER.includes(state))){
        return opts.fn(this);
    }
    return opts.inverse(this);
});

Handlebars.registerHelper('formatPriceSign', function (currencySign, dynamicValue) {
    if (currencySign === '₽') {
        return dynamicValue.toFixed(2).replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1 ") + ' руб.';
    }
    return currencySign + '' + dynamicValue.toFixed(2).replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1 ");
});

Handlebars.registerHelper('isUserLoginAndMerchantActive', function (isMerchantActive, isUser, opts) {
    if (isMerchantActive && isUser) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

Handlebars.registerHelper('i18n', (str, params) => {
    return $.i18n(str, params);
});

Handlebars.registerHelper('i18nComplex', (str, str1, params) => {
    return $.i18n(str + str1, params);
});

Handlebars.registerHelper('ifNotCondition', function(v1, v2, options) {
    if(v1 !== v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
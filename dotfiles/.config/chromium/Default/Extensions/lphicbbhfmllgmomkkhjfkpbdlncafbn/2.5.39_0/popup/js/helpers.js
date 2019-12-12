Handlebars.registerHelper('pickNum', function () {
  if (arguments.length > 0 && arguments[0]) {
    try {
      var num;
      var numChar;
      if (arguments[0]) {
        numChar = (parseFloat(arguments[0]) + "").length;
        num = arguments[0].substring(0, numChar);

        if (!num) {
          numChar = (parseFloat(arguments[1]) + "").length;
          num = arguments[1].substring(0, numChar);
        }
      } else {
        numChar = (parseFloat(arguments[1]) + "").length;
        num = arguments[1].substring(0, numChar);
      }

      return num;
    } catch (e) {
      framework.extension.log("pickNum - " + arguments[0]);
      return arguments[0];
    }
  }
});


Handlebars.registerHelper('cashbackConverter', function () {
  if (arguments.length > 0) {
    if (arguments[0].cashbackFloated) {
      return "+ до " + arguments[0].cashback + " кэшбэк";
    } else {
      return "+ " + arguments[0].cashback + " кэшбэк";
    }
  }
});

Handlebars.registerHelper('getHtml', function () {
  if (arguments.length > 0) {
    if (!arguments[0].indexOf("<") + 1) {
      return $(arguments[0]);
    } else {
      return arguments[0];
    }
  }
});

Handlebars.registerHelper('getTypeSpecBtn', function () {
  if (arguments.length > 0) {
    if (parseInt(arguments[0]) === FOOTER_ALL_STORES) {
      return $.i18n("footerShopsAll");
    } else if (parseInt(arguments[0]) === FOOTER_ALL_OFFERS) {
      return $.i18n("footerAllShopsPromo");
    }
  }
});

Handlebars.registerHelper('isUnread', function () {
  if (arguments.length > 0) {
    if (arguments[0] == "1") {
      return "letyshops-notification-markup-special";
    } else {
      return "";
    }
  }
  return ""
});

Handlebars.registerHelper('conditions', function () {
  if (arguments.length > 0) {
    if (arguments[0] != arguments[1]) {
      return "<span class='letyshops-store-cashback-default-line-through'>" + arguments[0] + "</span> - ";
    }
  }
  return "";
});

Handlebars.registerHelper('haveActiveNotify', function (conditional, options) {
  if (conditional && conditional.length) {
    if (_.findWhere(conditional, {status: "1"}))
      return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('updatestores', function () {
  if (framework.browser.name.toLowerCase() === 'safari') {
    _.delay(function () {
      popup.storesTab.render(null, null, false);
    }, 500);
  }
});

Handlebars.registerHelper('isUserLoginAndMerchantActive', function (isMerchantActive, isUser, opts) {
  if (isMerchantActive && isUser) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});

Handlebars.registerHelper('isUserLoginAndAdvicesActive', function (isAdvice, isUser, opts) {
  if (isAdvice && isUser) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});

Handlebars.registerHelper('getBrowser', () => {
  return Utils.getFullInfo().browser.toLowerCase();
});

Handlebars.registerHelper('i18n', (srt) => {
  return $.i18n(srt);
});

Handlebars.registerHelper('humanDate', str => {
  if (framework.browser.name === 'Safari') {
    str = str.slice(0, -5);
  }

  var date = new Date(str);

  var allMonth = $.i18n('notificationPriceChartMonth').split(',');
  var month = date.getMonth();
  return date.getDate() + " " + allMonth[month];
});

Handlebars.registerHelper('hasPermissionSegments', function (permissions = [], segments = [], options) {
  if (
    Array.isArray(segments) && segments.length &&
    Array.isArray(permissions) && permissions.length &&
    segments.filter(segments => permissions.includes(segments)).length
  ) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars["templates"] = Handlebars["templates"] || {};
Handlebars["templates"]["disabled_store"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-disabled\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\" viewbox=\"0 0 120 120\"><path fill=\"#EEE\" fill-rule=\"evenodd\" d=\"M60 0c8.281 0 16.074 1.562 23.379 4.688C90.684 7.813 97.05 12.09 102.48 17.52c5.43 5.43 9.707 11.796 12.832 19.101C118.439 43.926 120 51.72 120 60s-1.562 16.074-4.688 23.379c-3.125 7.305-7.402 13.672-12.832 19.101-5.43 5.43-11.796 9.707-19.101 12.832C76.074 118.439 68.28 120 60 120s-16.074-1.562-23.379-4.688c-7.305-3.125-13.672-7.402-19.101-12.832-5.43-5.43-9.707-11.796-12.832-19.101C1.562 76.074 0 68.28 0 60s1.562-16.074 4.688-23.379C7.813 29.316 12.09 22.95 17.52 17.52c5.43-5.43 11.796-9.707 19.101-12.832C43.926 1.562 51.72 0 60 0zm0 112.617c7.266 0 14.082-1.387 20.45-4.16 6.366-2.773 11.913-6.543 16.64-11.309 4.726-4.765 8.476-10.332 11.25-16.699 2.773-6.367 4.16-13.183 4.16-20.449 0-7.266-1.387-14.082-4.16-20.45-2.774-6.366-6.524-11.913-11.25-16.64-4.727-4.726-10.274-8.476-16.64-11.25C74.081 8.887 67.265 7.5 60 7.5s-14.082 1.387-20.45 4.16c-6.366 2.774-11.913 6.524-16.64 11.25-4.726 4.727-8.476 10.274-11.25 16.64C8.887 45.919 7.5 52.735 7.5 60s1.387 14.082 4.16 20.45c2.774 6.366 6.524 11.933 11.25 16.698 4.727 4.766 10.274 8.536 16.64 11.309 6.368 2.773 13.184 4.16 20.45 4.16zM56.25 56.25a3.75 3.75 0 0 1 7.5 0v30.02a3.75 3.75 0 0 1-7.5 0V56.25zM60 30a3.75 3.75 0 0 1 3.75 3.75v7.5a3.75 3.75 0 0 1-7.5 0v-7.5A3.75 3.75 0 0 1 60 30z\"></path></svg><span class=\"letyshops-disabled-title\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabDisabledStoreTitle",{"name":"i18n","hash":{},"data":data}))
    + "</span> <span class=\"letyshops-disabled-description\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabDisabledStoreDescription",{"name":"i18n","hash":{},"data":data}))
    + "</span> <button class=\"letyshops-disabled-button\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabDisabledStoreButton",{"name":"i18n","hash":{},"data":data}))
    + "</button></div>";
},"useData":true});
Handlebars["templates"]["footer"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isLogin : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"2":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"letyshops-footer-advice\"><div class=\"letyshops-footer-advice-title\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"footerAdviceTitle",{"name":"i18n","hash":{},"data":data}))
    + "</div><div id=\"letyshops-footer-advice-create\" class=\"letyshops-footer-advice-create\"><div><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewbox=\"0 0 24 24\"><g fill=\"none\" fill-rule=\"evenodd\"><circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#FC0\"></circle><path fill=\"#212121\" fill-rule=\"nonzero\" d=\"M13.322 10.678a.8.8 0 0 1 .232.616.8.8 0 0 1-.232.508.82.82 0 0 1-1.124 0 1.2 1.2 0 0 0-1.696 0l-2.554 2.551a1.2 1.2 0 1 0 1.698 1.698l1.51-1.512a.2.2 0 0 1 .218-.044c.406.166.841.25 1.28.248h.08a.2.2 0 0 1 .142.342l-2.1 2.1a2.8 2.8 0 0 1-3.958-3.962l2.544-2.545a2.8 2.8 0 0 1 3.96 0zm3.857-3.858a2.8 2.8 0 0 1 0 3.96l-2.546 2.546a2.8 2.8 0 0 1-1.297.736h-.022l-.116.024-.064.012-.138.02h-.068c-.052 0-.098.01-.142.011l-.12.014H12.514c-.1-.003-.2-.013-.298-.028a3.242 3.242 0 0 1-.242-.05l-.118-.031a1.589 1.589 0 0 1-.128-.042c-.042-.016-.086-.03-.128-.048-.042-.018-.084-.034-.126-.054a2.776 2.776 0 0 1-.8-.56.8.8 0 0 1 0-1.128.82.82 0 0 1 1.124 0 1.2 1.2 0 0 0 1.696 0l.656-.652.016-.018 1.875-1.874a1.2 1.2 0 1 0-1.697-1.698l-1.506 1.504a.2.2 0 0 1-.218.044 3.36 3.36 0 0 0-1.278-.25h-.074a.2.2 0 1 1-.146-.342L13.22 6.82a2.8 2.8 0 0 1 3.96 0z\"></path></g></svg></div><div id=\"letyshops-footer-advice-create-text\" class=\"letyshops-footer-advice-create-text\"><span style=\"border-bottom: 1px dashed #212121\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"footerAdviceCreateText",{"name":"i18n","hash":{},"data":data}))
    + "</span><div class=\"letyshops-footer-advice-info\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"footerAdviceInfo",{"name":"i18n","hash":{},"data":data}))
    + "</div></div><div><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"7\" viewbox=\"0 0 12 7\"><path fill=\"#121212\" fill-rule=\"nonzero\" d=\"M6.001 4.885L1.348.231A.788.788 0 0 0 .233.233.786.786 0 0 0 .23 1.348l5.214 5.214A.788.788 0 0 0 6.56 6.56l5.212-5.213A.792.792 0 0 0 11.77.233a.785.785 0 0 0-1.114-.002L6 4.885z\"></path></svg></div></div></div><div id=\"letyshops-footer-advice-hide\" style=\"display: none\"><div id=\"letyshops-footer-advice-hide-box\" class=\"letyshops-footer-advice-hide-box\"><div id=\"letyshops-footer-advice-hide-btn\" class=\"letyshops-footer-advice-hide-btn\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"footerAdviceHideBtn",{"name":"i18n","hash":{},"data":data}))
    + "</div><div style=\"transform: rotate(180deg); margin-bottom: 2px; fill: #a0a0a0;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"7\" viewbox=\"0 0 12 7\"><path fill-rule=\"nonzero\" d=\"M6.001 4.885L1.348.231A.788.788 0 0 0 .233.233.786.786 0 0 0 .23 1.348l5.214 5.214A.788.788 0 0 0 6.56 6.56l5.212-5.213A.792.792 0 0 0 11.77.233a.785.785 0 0 0-1.114-.002L6 4.885z\"></path></svg></div></div></div>";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-footer-wrapper\"><div class=\"letyshops-footer-switcher\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.stateSpecBtn : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "</div><div class=\"letyshops-footer-navigation\"><div id=\"letyshops-footer-help\" class=\"letyshops-footer-help\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"footerHelp",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Помощь\"><i>help</i></div><div id=\"letyshops-footer-settings\" class=\"letyshops-footer-settings\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"headerSettings",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Настройки\"><i>settings</i></div></div></div>";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " <span id=\"letyshops-footer-all-stores\" class=\"letyshops-footer-all-stores\" state=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.stateSpecBtn : depth0), depth0))
    + "\">"
    + ((stack1 = (helpers.getTypeSpecBtn || (depth0 && depth0.getTypeSpecBtn) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.stateSpecBtn : depth0),{"name":"getTypeSpecBtn","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span> ";
},"6":function(container,depth0,helpers,partials,data) {
    return "";
},"8":function(container,depth0,helpers,partials,data) {
    return "<div class=\"letyshops-footer-copy\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"mainCopyright",{"name":"i18n","hash":{},"data":data}))
    + "</span></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.isUserLoginAndAdvicesActive || (depth0 && depth0.isUserLoginAndAdvicesActive) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.stateAdvice : depth0),(depth0 != null ? depth0.isLogin : depth0),{"name":"isUserLoginAndAdvicesActive","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["header"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<div id=\"letyshops-header-info\" class=\"letyshops-header-info\"><div id=\"letyshops-header-info-notification\" class=\"letyshops-header-info-notification unselected-tab\">"
    + ((stack1 = (helpers.haveActiveNotify || (depth0 && depth0.haveActiveNotify) || alias2).call(alias1,(depth0 != null ? depth0.notifications : depth0),{"name":"haveActiveNotify","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " <i id=\"letyshops-header-settings\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"headerSettings",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Настройки\">settings</i></div><img src=\""
    + alias3(alias4((depth0 != null ? depth0.image : depth0), depth0))
    + "\" id=\"letyshops-header-info-user-picture\" class=\"letyshops-header-info-user-picture\"><div class=\"letyshops-header-info-balance\"><span>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.balanceInfo : depth0)) != null ? stack1.balanceApproved : stack1), depth0))
    + "</span> <span class=\"letyshops-header-info-balance-currency\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.balanceInfo : depth0)) != null ? stack1.currencyFormatted : stack1), depth0))
    + "</span> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.balanceInfo : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <span>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.balanceInfo : depth0)) != null ? stack1.balancePending : stack1), depth0))
    + "</span> <span class=\"letyshops-header-info-balance-currency\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.balanceInfo : depth0)) != null ? stack1.currencyFormatted : stack1), depth0))
    + "</span></div></div>";
},"2":function(container,depth0,helpers,partials,data) {
    return " <i id=\"letyshops-header-bell\" class=\"letyshops-header-bell-anim\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"headerBell",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Оповещения\">notifications_active</i> ";
},"4":function(container,depth0,helpers,partials,data) {
    return " <i id=\"letyshops-header-bell\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"headerBell",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Оповещения\">notifications_none</i> ";
},"6":function(container,depth0,helpers,partials,data) {
    return " <span>/</span> ";
},"8":function(container,depth0,helpers,partials,data) {
    return "<div id=\"letyshops-header-entry\" class=\"letyshops-header-entry\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"headerEntry",{"name":"i18n","hash":{},"data":data}))
    + "</span></div>";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div id=\"letyshops-tab-invite\" class=\"letyshops-tab unselected-tab\"><div class=\"letyshops-tab-title\">"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteName",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-tab-line\" style=\"visibility: hidden\"></div></div>"
    + ((stack1 = (helpers.hasPermissionSegments || (depth0 && depth0.hasPermissionSegments) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.permissionsSegments : depth0)) != null ? stack1.letyprice : stack1),(depth0 != null ? depth0.segments : depth0),{"name":"hasPermissionSegments","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.hasPermissionSegments || (depth0 && depth0.hasPermissionSegments) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.permissionsSegments : depth0)) != null ? stack1.letyclub : stack1),(depth0 != null ? depth0.segments : depth0),{"name":"hasPermissionSegments","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"11":function(container,depth0,helpers,partials,data) {
    return "<div id=\"letyshops-tab-news\" class=\"letyshops-tab unselected-tab\"><div class=\"letyshops-tab-marker\"><img src=\"img/news/letyclub/navigation-marker.png\"></div><div class=\"letyshops-tab-title\">"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabsNewsLetypriceTrigger",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-tab-line\" style=\"visibility: hidden\"></div></div>";
},"13":function(container,depth0,helpers,partials,data) {
    return "<div id=\"letyshops-tab-news\" class=\"letyshops-tab unselected-tab\"><div class=\"letyshops-tab-marker\"><img src=\"img/news/letyclub/navigation-marker.png\"></div><div class=\"letyshops-tab-title\">"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabsNewsLetyclubTrigger",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-tab-line\" style=\"visibility: hidden\"></div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-header letyshops-gradient-scheme-blue\"><div class=\"letyshops-header-status\"><div class=\"letyshops-header-company\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"102\" height=\"24\" viewbox=\"0 0 81 19\"><g fill=\"#FFF\" fill-rule=\"evenodd\"><path d=\"M33.083 5.116l-1.47 8.371c-.478 2.754-2.463 4.232-4.925 4.232-1.618 0-3.418-.646-4.631-2.07l1.837-2.125c.92.795 1.691 1.35 2.794 1.35.918 0 1.58-.389 1.782-1.48l.055-.35a3.69 3.69 0 0 1-2.131.647c-1.93 0-3.18-1.35-3.18-3.087 0-.295.037-.683.092-.98l.79-4.508h3.161l-.772 4.398c-.018.11-.036.24-.036.351 0 .665.533 1.146 1.25 1.146.66 0 1.267-.407 1.396-1.183l.827-4.712h3.16zM9.17 8.923h3.197c-.018-.887-.68-1.35-1.433-1.35-.79 0-1.47.5-1.764 1.35zm6.058.166c0 .684-.165 1.386-.367 1.867H9.072c.294.72.974 1.034 1.966 1.034.883 0 1.673-.258 2.463-.702l1.01 2.107c-1.157.813-2.388 1.22-3.748 1.22-2.922 0-4.87-1.885-4.87-4.454 0-2.81 2.316-5.045 5.182-5.045 2.591 0 4.153 1.848 4.153 3.973zM3.236 10.494c-.018.147-.037.258-.037.388 0 .813.662 1.016 1.82 1.016h.735l-.46 2.624a7.23 7.23 0 0 1-1.176.093c-1.746 0-4.116-.5-4.116-3.105 0-.333.037-.647.092-.98l.46-2.568.459-2.625.577-3.309h3.16l-.595 3.31-.46 2.624-.459 2.532zm13.717-2.768h-1.419l.435-2.613h1.441l.538-3.085h3.161l-.555 3.085h2.421l-.434 2.613h-2.446l-.041.236-.46 2.532c-.018.147-.036.258-.036.388 0 .813.661 1.016 1.819 1.016h.735l-.46 2.624a7.231 7.231 0 0 1-1.176.093c-1.745 0-4.116-.5-4.116-3.105 0-.333.037-.647.092-.98l.46-2.568.04-.236z\"></path><path d=\"M66.816 11.776c1.084 0 1.91-.904 1.93-2.048.018-1.07-.699-1.771-1.691-1.771-1.085 0-1.93.83-1.948 1.974-.019 1.107.716 1.845 1.709 1.845zm1.231-6.66c2.407 0 3.932 1.992 3.932 4.261 0 2.214-1.47 5.24-4.924 5.24-1.213 0-2.058-.369-2.591-1.015l-.699 4.096h-3.16l2.168-12.36h2.885l-.147.866c.606-.72 1.488-1.088 2.536-1.088zm-12.063 6.658c1.066 0 1.911-.83 1.93-1.974.018-1.108-.717-1.827-1.691-1.827-1.066 0-1.874.886-1.893 2.03-.018 1.07.68 1.77 1.654 1.77zm.368-6.642c2.72 0 4.796 1.974 4.796 4.557 0 2.822-2.463 4.926-5.293 4.926-2.738 0-4.759-1.974-4.759-4.539 0-2.822 2.444-4.944 5.256-4.944zM78.38 8.49c-.57-.61-1.25-.904-1.783-.904-.367 0-.533.147-.533.369 0 .24.184.35.496.48l.827.313c1.489.59 2.481 1.383 2.481 2.712 0 1.328-.974 3.155-3.749 3.155-1.782 0-3.326-.757-4.134-2.085l1.856-1.716c.68.793 1.36 1.347 2.297 1.347.404 0 .771-.11.771-.406 0-.221-.183-.35-.496-.48l-.863-.332c-1.47-.59-2.463-1.383-2.463-2.878 0-1.826 1.452-2.933 3.437-2.933 1.543 0 2.774.553 3.62 1.587l-1.764 1.77zM50.398 9.54l-.882 5.074h-3.161l.845-4.926c.037-.148.055-.314.055-.461 0-.72-.514-1.163-1.25-1.163-.68 0-1.249.388-1.396 1.255l-.919 5.295h-3.16l2.2-12.53h3.16l-.711 3.97c.551-.425 1.25-.702 2.15-.702 1.893 0 3.179 1.255 3.179 3.118 0 .332-.037.664-.11 1.07zM38.825 8.49c-.57-.61-1.25-.904-1.782-.904-.368 0-.533.147-.533.369 0 .24.184.35.496.48l.827.313c1.489.59 2.48 1.383 2.48 2.712 0 1.328-.973 3.155-3.748 3.155-1.782 0-3.326-.757-4.135-2.085l1.856-1.716c.68.793 1.36 1.347 2.298 1.347.404 0 .771-.11.771-.406 0-.221-.183-.35-.496-.48l-.864-.332c-1.47-.59-2.462-1.383-2.462-2.878 0-1.826 1.452-2.933 3.436-2.933 1.544 0 2.775.553 3.62 1.587l-1.764 1.77z\" opacity=\".5\"></path></g></svg></div>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.token : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "</div><div class=\"letyshops-header-tabs\"><div id=\"letyshops-tab-stores\" class=\"letyshops-tab selected-tab\"><div class=\"letyshops-tab-title\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresName",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-tab-line\" style=\"visibility: visible\"></div></div><div id=\"letyshops-tab-offers\" class=\"letyshops-tab unselected-tab\"><div class=\"letyshops-tab-title\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabOffersName",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-tab-line\" style=\"visibility: hidden\"></div></div>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.token : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div>";
},"useData":true});
Handlebars["templates"]["invitation_tab"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " <img id=\"letyshops-invitation-vk\" class=\"letyshops-invitation-vk\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabInviteInvitationVk",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"ВКонтакте\" src=\"img/ic_vk.png\"> ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <img id=\"letyshops-invitation-ok\" class=\"letyshops-invitation-ok\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabInviteInvitationOk",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Одноклассники\" src=\"img/ic_school.png\"> ";
},"5":function(container,depth0,helpers,partials,data) {
    return " <img id=\"letyshops-invitation-mv\" class=\"letyshops-invitation-mw\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabInviteInvitationMw",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Мой Мир\" src=\"img/ic_my_world.png\"> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<div class=\"letyshops-content-invitation\"><div class=\"letyshops-scroll-list scroll-pane\"><div class=\"letyshops-invitation-tab-wrapper\"><div class=\"letyshops-invitation-cashback\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationCashback",{"name":"i18n","hash":{},"data":data}))
    + " <span>"
    + alias3(alias4((depth0 != null ? depth0.partnerPercent : depth0), depth0))
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationPartnerPercent",{"name":"i18n","hash":{},"data":data}))
    + "</span></div><div class=\"letyshops-invitation-referral-description\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationReferralDescription",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-invitation-social\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showSocialNetworks : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <img id=\"letyshops-invitation-fb\" class=\"letyshops-invitation-fb\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationFb",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Facebook\" src=\"img/ic_fb.png\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showSocialNetworks : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <img id=\"letyshops-invitation-tw\" class=\"letyshops-invitation-tw\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationTw",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Twitter\" src=\"img/ic_twitter.png\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showSocialNetworks : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div><div class=\"letyshops-invitation-referral-box\"><div class=\"letyshops-invitation-referral-box-header\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationReferralBoxHeader",{"name":"i18n","hash":{},"data":data}))
    + "</div><div id=\"letyshops-referral-box-link\" class=\"letyshops-invitation-referral-box-link\">"
    + alias3(alias4((depth0 != null ? depth0.partnerUrl : depth0), depth0))
    + "</div><div id=\"letyshops-referral-link-copy\" class=\"letyshops-invitation-referral-box-btn\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationReferralBoxBtn",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Копировать\"><i>content_copy</i><div class=\"copy-success\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabInviteInvitationCopySuccess",{"name":"i18n","hash":{},"data":data}))
    + "</div></div></div></div></div></div>";
},"useData":true});
Handlebars["templates"]["news_tab"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-content-news letyshops-content-news--letyprice\"><div class=\"letyshops-scroll-list scroll-pane\"><div class=\"letyshops-content-news__wrapper\"><div class=\"letyshops-content-news__body\"><div class=\"letyshops-content-news__body-content\"><div class=\"letyshops-content-news__content\"><p><b>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetypriceBodyContentAccent",{"name":"i18n","hash":{},"data":data}))
    + "</b></p><p>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetypriceBodyContent",{"name":"i18n","hash":{},"data":data}))
    + "</p></div></div><div class=\"letyshops-content-news__body-gallery\"><div class=\"letyshops-content-news__gallery\"><div class=\"letyshops-content-news__gallery-item\"><img src=\"img/news/letyprice/steps/step-1.png\"></div><div class=\"letyshops-content-news__gallery-item\"><img src=\"img/news/letyprice/steps/step-2.png\"></div><div class=\"letyshops-content-news__gallery-item\"><img src=\"img/news/letyprice/steps/step-3.png\"></div></div></div></div><div class=\"letyshops-content-news__footer\"><div class=\"letyshops-content-news__footer-actions\"><div class=\"letyshops-content-news__actions letyshops-content-news__actions--center\"><div class=\"letyshops-content-news__actions-item\"><button class=\"letyshops-content-news__btn trigger-action trigger-action--redirect-letyprice\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetypriceFooterAction",{"name":"i18n","hash":{},"data":data}))
    + "</button></div></div></div></div></div></div></div>";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-content-news letyshops-content-news--letyclub\"><div class=\"letyshops-scroll-list scroll-pane\"><div class=\"letyshops-content-news__wrapper\"><div class=\"letyshops-content-news__body\"><div class=\"letyshops-content-news__body-content\"><div class=\"letyshops-content-news__content\"><p><b>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetyclubBodyContentAccent",{"name":"i18n","hash":{},"data":data}))
    + "</b></p><p>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetyclubBodyContent",{"name":"i18n","hash":{},"data":data}))
    + " <span class=\"trigger-action trigger-action--redirect-letyclub\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetyclubBodyContentAction",{"name":"i18n","hash":{},"data":data}))
    + "</span></p></div></div><div class=\"letyshops-content-news__body-gallery\"><div class=\"letyshops-content-news__gallery\"><div class=\"letyshops-content-news__gallery-item\"><img src=\"img/news/letyclub/promo.png\"></div></div></div><div class=\"letyshops-content-news__footer\"><div class=\"letyshops-content-news__footer-actions\"><div class=\"letyshops-content-news__actions letyshops-content-news__actions--center\"><div class=\"letyshops-content-news__actions-item\"><button class=\"letyshops-content-news__btn trigger-action trigger-action--redirect-letyclub\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabsNewsLetyclubFooterAction",{"name":"i18n","hash":{},"data":data}))
    + "</button></div></div></div></div></div></div></div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.hasPermissionSegments || (depth0 && depth0.hasPermissionSegments) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.permissionsSegments : depth0)) != null ? stack1.letyprice : stack1),(depth0 != null ? depth0.segments : depth0),{"name":"hasPermissionSegments","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.hasPermissionSegments || (depth0 && depth0.hasPermissionSegments) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.permissionsSegments : depth0)) != null ? stack1.letyclub : stack1),(depth0 != null ? depth0.segments : depth0),{"name":"hasPermissionSegments","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["notification_tab"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"letyshops-notification-tab-item "
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><div class=\"letyshops-notification-date\"><span>"
    + alias4((helpers.humanDate || (depth0 && depth0.humanDate) || alias2).call(alias1,(depth0 != null ? depth0.date : depth0),{"name":"humanDate","hash":{},"data":data}))
    + "</span></div><div class=\"letyshops-notification-markup-wrapper\"><div class=\"letyshops-notification-markup "
    + ((stack1 = (helpers.isUnread || (depth0 && depth0.isUnread) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),{"name":"isUnread","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.markup || (depth0 != null ? depth0.markup : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"markup","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div></div></div>";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"letyshops-content-notification\"><div class=\"letyshops-scroll-list scroll-pane\"><div class=\"letyshops-notification-tab-wrapper\">"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div></div>";
},"useData":true});
Handlebars["templates"]["offers_tab"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"letyshops-content-offers\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.specialOffer : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-scroll-list\" class=\"letyshops-scroll-list\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.specialOffer : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.offers : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-offers-tab-item-special\" class=\"letyshops-offers-tab-item-special\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabOffersAllShopsPromo",{"name":"i18n","hash":{},"data":data}))
    + "</span></div></div></div><div id=\"letyshops-offers-tab-item-special\" class=\"letyshops-scroll-list-blur\"></div></div></div>";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"letyshops-special-content\"><div id=\"letyshops-offer-tab-item\" class=\"letyshops-special-offer\" offer-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.specialOffer : depth0)) != null ? stack1.id : stack1), depth0))
    + "\"><div class=\"letyshops-special-img\"><img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.specialOffer : depth0)) != null ? stack1.image : stack1), depth0))
    + "\"></div><div class=\"letyshops-special-divider\"></div><div class=\"letyshops-special-point\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.specialOffer : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span></div></div></div><div class=\"letyshops-offers-tab-color-block\"></div>";
},"4":function(container,depth0,helpers,partials,data) {
    return "<div class=\"letyshops-offers-tab-wrapper\" style=\"margin-top: 141px !important\">";
},"6":function(container,depth0,helpers,partials,data) {
    return "<div class=\"letyshops-offers-tab-wrapper\">";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"letyshops-offer-tab-item\" class=\"letyshops-offer-tab-item\" offer-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><div class=\"letyshops-offer-logo\"><img src=\""
    + alias4(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data}) : helper)))
    + "\"></div><div class=\"letyshops-offer-description\" style=\"width: 270px !important\"><div class=\"letyshops-offer-point\"><span>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span></div><div class=\"letyshops-offer-cashback\"><span>"
    + alias4(((helper = (helper = helpers.shortDesc || (depth0 != null ? depth0.shortDesc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shortDesc","hash":{},"data":data}) : helper)))
    + "</span></div></div></div>";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"letyshops-content-offers\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.specialOffer : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-scroll-list\" class=\"letyshops-scroll-list\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.specialOffer : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.offers : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-offers-tab-item-special\" class=\"letyshops-offers-tab-item-special\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabOffersAllShopsPromo",{"name":"i18n","hash":{},"data":data}))
    + "</span></div></div></div><div class=\"letyshops-scroll-list-blur\"></div></div></div>";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"letyshops-offer-tab-item\" class=\"letyshops-offer-tab-item\" offer-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><div class=\"letyshops-offer-logo\"><img src=\""
    + alias4(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data}) : helper)))
    + "\"></div><div class=\"letyshops-offer-description\"><div class=\"letyshops-offer-point\"><span>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span></div><div class=\"letyshops-offer-cashback\"><span>"
    + alias4(((helper = (helper = helpers.shortDesc || (depth0 != null ? depth0.shortDesc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shortDesc","hash":{},"data":data}) : helper)))
    + "</span></div></div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isLogin : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["settings_tab"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"letyshops-content-settings\"></div>";
},"useData":true});
Handlebars["templates"]["stores_tab"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"letyshops-content-stores\"><div class=\"letyshops-search-bar-container\"><div class=\"letyshops-search-bar-wrapper\"><input id=\"letyshops-search-bar\" class=\"letyshops-search-bar\" placeholder=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabStoresSearch",{"name":"i18n","hash":{},"data":data}))
    + "\" type=\"text\"><div id=\"letyshops-search-bar-btn\" class=\"letyshops-search-bar-btn\"><i>search</i></div></div></div>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isFilled : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(20, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"letyshops-scroll-list\" class=\"letyshops-scroll-list\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isRenderedSearchRequest : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "</div><div class=\"letyshops-scroll-list-blur\"></div>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"letyshops-stores-tab-wrapper\">"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.merchants : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-stores-tab-item-special\" class=\"letyshops-stores-tab-item-special\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabStoresAll",{"name":"i18n","hash":{},"data":data}))
    + "</span></div></div>";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"letyshops-stores-tab-item\" class=\"letyshops-stores-tab-item\" store-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><div class=\"letyshops-store-logo\"><img src=\""
    + alias4(((helper = (helper = helpers.logo || (depth0 != null ? depth0.logo : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logo","hash":{},"data":data}) : helper)))
    + "\"></div><div class=\"letyshops-store-description\" style=\"width: 160px\"><div class=\"letyshops-store-name\"><span>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span></div>"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.settings : depth0)) != null ? stack1.partnerListNoActive : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"letyshops-store-type\"><span>"
    + alias4(((helper = (helper = helpers.shortDesc || (depth0 != null ? depth0.shortDesc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shortDesc","hash":{},"data":data}) : helper)))
    + "</span></div></div><div class=\"letyshops-store-cashback-extended\"><div class=\"letyshops-store-cashback-user\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cashbackFloated : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<span>"
    + ((stack1 = (helpers.pickNum || (depth0 && depth0.pickNum) || alias2).call(alias1,(depth0 != null ? depth0.userCashback : depth0),{"name":"pickNum","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + alias4(((helper = (helper = helpers.suffix || (depth0 != null ? depth0.suffix : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"suffix","hash":{},"data":data}) : helper)))
    + "</div><div class=\"letyshops-store-cashback-default\">"
    + alias4(((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cashback","hash":{},"data":data}) : helper)))
    + "</div></div>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isFavorite : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"5":function(container,depth0,helpers,partials,data) {
    return "<div class=\"letyshops-store-description-no-active\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoresDescriptionNoActive",{"name":"i18n","hash":{},"data":data}))
    + "</span></div>";
},"7":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoresCashbackUser",{"name":"i18n","hash":{},"data":data}))
    + " ";
},"9":function(container,depth0,helpers,partials,data) {
    return "";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"letyshops-store-heart\"><i id=\"letyshops-store-heart\" class=\"red\" favorite=\"true\" store-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">favorite</i></div>";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"letyshops-store-heart\"><i id=\"letyshops-store-heart\" class=\"grey\" favorite=\"false\" store-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">favorite_border</i></div>";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.merchants : depth0)) != null ? stack1.viewed : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.merchants : depth0)) != null ? stack1.recommended : stack1),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"letyshops-stores-tab-section\">"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabStoresViewed",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-stores-tab-wrapper\" style=\"margin: 2px 15px 10px!important\">"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.merchants : depth0)) != null ? stack1.viewed : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-stores-tab-section\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresRecommended",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-stores-tab-wrapper\" style=\"margin: 2px 15px 10px!important\">"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.merchants : depth0)) != null ? stack1.recommended : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-stores-tab-item-special\" class=\"letyshops-stores-tab-item-special\"><span>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresAll",{"name":"i18n","hash":{},"data":data}))
    + "</span></div></div>";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isRenderedSearchRequest : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.program(26, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.merchantsDisabled : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.program(24, data, 0),"data":data})) != null ? stack1 : "");
},"22":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-stores-empty\"><div class=\"letyshops-title-no-search\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresTitleNoSearch",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-description-no-search\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresDescriptionNoSearch",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-notification-activate\"><div class=\"letyshops-notification-shell-button\"><a href=\"https://letyshops.com/shops?utm_source=extension&utm_campaign=search&utm_term="
    + alias3(((helper = (helper = helpers.getBrowser || (depth0 != null ? depth0.getBrowser : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"getBrowser","hash":{},"data":data}) : helper)))
    + "\"><button>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresNotificationShellButton",{"name":"i18n","hash":{},"data":data}))
    + "</button></a></div></div></div>";
},"24":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-stores-empty\"><div class=\"letyshops-stores-empty-img\"></div><div class=\"letyshops-stores-empty-result\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresEmptyResult",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-stores-empty-notice\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresEmptyNotice",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-notification-activate\" style=\"bottom: 10px\"><div class=\"letyshops-notification-shell-button\"><a href=\"https://letyshops.com/shops?utm_source=extension&utm_campaign=search&utm_term="
    + alias3(((helper = (helper = helpers.getBrowser || (depth0 != null ? depth0.getBrowser : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"getBrowser","hash":{},"data":data}) : helper)))
    + "\"><button>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresNotificationShellButton",{"name":"i18n","hash":{},"data":data}))
    + "</button></a></div></div></div>";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, buffer = 
  " ";
  stack1 = ((helper = (helper = helpers.updatestores || (depth0 != null ? depth0.updatestores : depth0)) != null ? helper : alias2),(options={"name":"updatestores","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.updatestores) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<div class=\"letyshops-stores-empty\"><div class=\"letyshops-stores-empty-img\"></div><div class=\"letyshops-stores-empty-result\" style=\"width: 80%\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresEmptyResultError",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-stores-empty-notice\" style=\"padding-top: 24px\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresEmptyNoticeError",{"name":"i18n","hash":{},"data":data}))
    + "</div></div>";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"letyshops-content-stores\"><div class=\"letyshops-search-bar-container\"><div class=\"letyshops-search-bar-wrapper\"><input id=\"letyshops-search-bar\" class=\"letyshops-search-bar\" placeholder=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabStoresSearch",{"name":"i18n","hash":{},"data":data}))
    + "\" type=\"text\"><div id=\"letyshops-search-bar-btn\" class=\"letyshops-search-bar-btn\"><i>search</i></div></div></div>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isFilled : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.program(32, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"letyshops-scroll-list\" class=\"letyshops-scroll-list\"><div class=\"letyshops-stores-tab-wrapper\">"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.merchants : depth0),{"name":"each","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-stores-tab-item-special\" class=\"letyshops-stores-tab-item-special\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(alias1,"tabStoresAll",{"name":"i18n","hash":{},"data":data}))
    + "</span></div></div></div><div class=\"letyshops-scroll-list-blur\"></div>";
},"30":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"letyshops-stores-tab-item\" class=\"letyshops-stores-tab-item\" store-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><div class=\"letyshops-store-logo\"><img src=\""
    + alias4(((helper = (helper = helpers.logo || (depth0 != null ? depth0.logo : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logo","hash":{},"data":data}) : helper)))
    + "\"></div><div class=\"letyshops-store-description\"><div class=\"letyshops-store-name\"><span>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span></div>"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.settings : depth0)) != null ? stack1.partnerListNoActive : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"letyshops-store-type\"><span>"
    + alias4(((helper = (helper = helpers.shortDesc || (depth0 != null ? depth0.shortDesc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shortDesc","hash":{},"data":data}) : helper)))
    + "</span></div></div><div class=\"letyshops-store-cashback-extended\"><div class=\"letyshops-store-cashback-user\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cashbackFloated : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<span>"
    + ((stack1 = (helpers.pickNum || (depth0 && depth0.pickNum) || alias2).call(alias1,(depth0 != null ? depth0.userCashback : depth0),{"name":"pickNum","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + alias4(((helper = (helper = helpers.suffix || (depth0 != null ? depth0.suffix : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"suffix","hash":{},"data":data}) : helper)))
    + "</div><div class=\"letyshops-store-cashback-default\">"
    + alias4(((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cashback","hash":{},"data":data}) : helper)))
    + "</div></div></div>";
},"32":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isRenderedSearchRequest : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.program(35, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"33":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.merchantsDisabled : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.program(24, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, buffer = "";

  stack1 = ((helper = (helper = helpers.updatestores || (depth0 != null ? depth0.updatestores : depth0)) != null ? helper : alias2),(options={"name":"updatestores","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.updatestores) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<div class=\"letyshops-stores-empty\"><div class=\"letyshops-stores-empty-img\"></div><div class=\"letyshops-stores-empty-result\" style=\"width: 80%\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresEmptyResultError",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-stores-empty-notice\" style=\"padding-top: 24px\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoresEmptyNoticeError",{"name":"i18n","hash":{},"data":data}))
    + "</div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isLogin : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["store_card"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoreCashbackUserSuffix",{"name":"i18n","hash":{},"data":data}))
    + " ";
},"3":function(container,depth0,helpers,partials,data) {
    return "";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.isFavorite : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"letyshops-store-heart\"><i id=\"letyshops-store-heart\" class=\"red\" favorite=\"true\" store-id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">favorite</i></div>";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"letyshops-store-heart\"><i id=\"letyshops-store-heart\" class=\"grey\" favorite=\"false\" store-id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">favorite_border</i></div>";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"letyshops-card-body-rules-merchant-conditions\">"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.conditionsFormated : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<div class=\"letyshops-card-body-rules-merchant-conditions-item\">"
    + ((stack1 = (helpers.conditions || (depth0 && depth0.conditions) || alias2).call(alias1,(depth0 != null ? depth0.rateFormated : depth0),(depth0 != null ? depth0.currentRateFormated : depth0),{"name":"conditions","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <span class=\"letyshops-store-cashback-current-rate\">"
    + container.escapeExpression(((helper = (helper = helpers.currentRateFormated || (depth0 != null ? depth0.currentRateFormated : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"currentRateFormated","hash":{},"data":data}) : helper)))
    + "</span> - "
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return " "
    + ((stack1 = helpers.unless.call(alias1,((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.isActivated : stack1),{"name":"unless","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.isUserLoginAndMerchantActive || (depth0 && depth0.isUserLoginAndMerchantActive) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.isActivated : stack1),(depth0 != null ? depth0.isLogin : depth0),{"name":"isUserLoginAndMerchantActive","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"letyshops-card-footer letyshops-card-footer-non-activated\"><div class=\"letyshops-notification-without-activate-title\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoreNotificationWithoutActivateTitle",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-card-footer-no-activated\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoreCardFooterNoActivated",{"name":"i18n","hash":{},"data":data}))
    + " <a href=\"https://letyshops.com/shops?utm_source=extension&utm_campaign=popup-no-activate-cashback&utm_term="
    + alias3(((helper = (helper = helpers.getBrowser || (depth0 != null ? depth0.getBrowser : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"getBrowser","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"tabStoreCardFooterNoActivatedLLInk",{"name":"i18n","hash":{},"data":data}))
    + "</a></div></div>";
},"16":function(container,depth0,helpers,partials,data) {
    return "<div id=\"letyshops-cashback-activated\" class=\"letyshops-card-footer-activated\"><div class=\"letyshops-notification-activated-img\"><i>check_circle</i></div><div class=\"letyshops-notification-activated-text\"><span>"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoreNotificationActivatedText",{"name":"i18n","hash":{},"data":data}))
    + "</span></div></div>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = (helpers.isUserLoginAndMerchantActive || (depth0 && depth0.isUserLoginAndMerchantActive) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.isActivated : stack1),(depth0 != null ? depth0.isLogin : depth0),{"name":"isUserLoginAndMerchantActive","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"letyshops-card-footer\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isLogin : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.program(22, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"20":function(container,depth0,helpers,partials,data) {
    return " <button id=\"letyshops-cashback-activate\" class=\"letyshops-card-main-btn\">"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoreCashbackActivateText",{"name":"i18n","hash":{},"data":data}))
    + "</button> ";
},"22":function(container,depth0,helpers,partials,data) {
    return " <button id=\"letyshops-cashback-activate\" class=\"letyshops-card-main-btn\">"
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoreCashbackActivateLogin",{"name":"i18n","hash":{},"data":data}))
    + "</button> ";
},"24":function(container,depth0,helpers,partials,data) {
    return " <img id=\"letyshops-advice-vk\" class=\"letyshops-advice-vk\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoreVkAdvice",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"ВКонтакте\" src=\"img/ic_vk.png\"> ";
},"26":function(container,depth0,helpers,partials,data) {
    return " <img id=\"letyshops-advice-ok\" class=\"letyshops-advice-ok\" title=\""
    + container.escapeExpression((helpers.i18n || (depth0 && depth0.i18n) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"tabStoreOkAdvice",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Одноклассники\" src=\"img/ic_school.png\"> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return "<div class=\"letyshops-content-store\" xmlns:style=\"http://www.w3.org/1999/xhtml\"><div class=\"letyshops-card-store\"><div class=\"letyshops-card-body\"><div class=\"letyshops-card-body-info\"><div class=\"letyshops-store-logo\"><img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.logo : stack1), depth0))
    + "\"></div><div class=\"letyshops-store-empty\"></div><div class=\"letyshops-store-cashback\"><div class=\"letyshops-store-cashback-user\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreCashbackUser",{"name":"i18n","hash":{},"data":data}))
    + " "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.cashbackFloated : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<span>"
    + ((stack1 = (helpers.pickNum || (depth0 && depth0.pickNum) || alias4).call(alias3,((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.userCashback : stack1),{"name":"pickNum","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.suffix : stack1), depth0))
    + "</div><div class=\"letyshops-store-cashback-user-default\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.cashback : stack1), depth0))
    + "</div></div>"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.isLogin : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div><div class=\"letyshops-card-body-rules\"><div class=\"letyshops-card-body-rules-header\"><span>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreCardBodyRulesHeader",{"name":"i18n","hash":{},"data":data}))
    + "</span></div><div class=\"letyshops-card-body-rules-conditions\">"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.conditionsFormated : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.longDesc : stack1), depth0)) != null ? stack1 : "")
    + "</div></div></div>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.settings : stack1)) != null ? stack1.partnerListNoActive : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "<div id=\"letyshops-card-footer-advice\" class=\"letyshops-card-footer-advice-show\"><div class=\"letyshops-card-footer-advice-title\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreFooterAdviceTitle",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-card-footer-advice-title-box\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreFooterAdviceTitleBox",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-invitation-referral-box-advice\"><div id=\"letyshops-box-btn-advice-link\" class=\"letyshops-box-link-advice\"></div><div id=\"letyshops-box-btn-advice-copy\" class=\"letyshops-box-btn-advice\" title=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreCopyBoxBtnAdvice",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Копировать\"><i>content_copy</i><div class=\"copy-success-advice\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreCopySuccessAdvice",{"name":"i18n","hash":{},"data":data}))
    + "</div></div></div><div class=\"letyshops-card-footer-advice-soc\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreFooterAdviceSoc",{"name":"i18n","hash":{},"data":data}))
    + "</div><div class=\"letyshops-invitation-social-advice\">"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.showSocialNetworks : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <img id=\"letyshops-advice-fb\" class=\"letyshops-advice-fb\" title=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreFbAdvice",{"name":"i18n","hash":{},"data":data}))
    + "\" alt=\"Facebook\" src=\"img/ic_fb.png\"> "
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.showSocialNetworks : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div><div id=\"letyshops-footer-advice-hide-soc-info\" class=\"letyshops-footer-advice-hide-soc-info\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"tabStoreFooterAdviceHideSocInfo",{"name":"i18n","hash":{},"data":data}))
    + "</div></div></div></div>";
},"useData":true});
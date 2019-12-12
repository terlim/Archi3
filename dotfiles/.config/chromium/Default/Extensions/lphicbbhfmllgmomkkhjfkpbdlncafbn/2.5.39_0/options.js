(function () {
    const page_port = chrome.runtime.connect({name: "optionspresence"});

    document.addEventListener('DOMContentLoaded', async () => {
        const framework = chrome.extension.getBackgroundPage().framework;
        const i18nDataLocale = await Storage.syncGet('i18nDataLocale');

        $.i18n().locale = Object.keys(i18nDataLocale)[0];
        $.i18n().load(i18nDataLocale);

        $('title').text($.i18n("letyshopsOptionsMainTitle"));
        $('#letyshopsOptionsTitle').text($.i18n("letyshopsOptionsTitle"));
        $('#showPriceLabel').text($.i18n("letyshopsOptionsLabelShowPrice"));
        $('#showCashbackHintsLabel').text($.i18n("letyshopsOptionsLabelShowCashbackHints"));
        $('#showSimilarListLabel').text($.i18n("letyshopsOptionsLabelShowSimilarList"));
        $('#letyshopsOptionsTitleTop').text($.i18n("letyshopsOptionsTitleTop"));
        $('#showPromoNotificationsLabel').text($.i18n("letyshopsOptionsLabelShowPromoNotifications"));
        $('#showUserNotificationsLabel').text($.i18n("letyshopsOptionsLabelShowUserNotifications"));
        $('#helpLink').text($.i18n("letyshopsOptionsLinksHelp"));
        $('#privacyPolicyLink').text($.i18n("letyshopsOptionsLinksPrivacyPolicy"));

        const locale = await Storage.syncGet('locale') || '';
         $('#helpLink').attr('href', ApiClient.helpPage(locale.split('_')[0]));
         $('#privacyPolicyLink').attr('href', ApiClient.confidentialPage());

        var options = [
            {
                label: 'Show Price Monitoring',
                val: 'showPrice'
            },
            {
                label: 'Show User Notifications',
                val: 'showUserNotifications'
            },
            {
                label: 'Show Promo Notifications',
                val: 'showPromoNotifications'
            },
            {
                label: 'Show SERP',
                val: 'showCashbackHints'
            },
            {
                label: 'Shop Recomendation',
                val:  'showSimilarList'
            }
        ];

        let userSettings = {};
        options.forEach(function (option) {
            Storage.get(option.val, function (item) {
                if (typeof item === "undefined") {
                    Storage.set(option.val, true);
                    item = true;
                }

                let val = option.val;
                userSettings[val] = item;
                Storage.set('userSettings', userSettings);
                document.getElementById(option.val).checked = item;
            });

            document.getElementById(option.val).addEventListener('click', function () {
                var value = document.getElementById(option.val).checked;
                Storage.set(option.val, value);

                framework.extension.fireEvent(SEND_GOOGLE_ANALYTICS,
                    {
                        tabId: null,
                        data: {
                            type: 'event',
                            category: 'Settings',
                            action: value ? 'On' : 'Off',
                            label: option.label
                        }
                    }
                );

                Storage.get('userSettings', (data) => {
                    if (!data) {
                        data = {};
                    }

                    let val = option.val;
                    data[val] = value;
                    Storage.set('userSettings', data);
                });
            });
        });
    });
})();
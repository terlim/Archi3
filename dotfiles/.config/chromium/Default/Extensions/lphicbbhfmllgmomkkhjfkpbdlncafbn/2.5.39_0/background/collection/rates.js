var Rates = Backbone.Collection.extend({
    model: Rate,
    flag: "codes",
    updateFlag: "codesLastUpdated",
    url: ApiClient.userCodes(),

    initialize: function () {
        var self = this;
        self.on("reset", function () {
            self.save();
        });
        self.fetch();
    },

    save: function () {
        Storage.set(this.flag, this.toJSON());
    },

    toJSON: function (models = this.models) {
        return models.map && models.map(model => model.toJSON());
    },

    fetch: async function (force) {
        if (!arguments[0]) {
            arguments[0] = { };
            arguments.length = 1;
        }
        var self = this,
            _arguments = arguments,
            _options = arguments[0],
            _callee = arguments.callee;  // it is reference on the function
        // Storage.set(self.updateFlag, 0);

        const locale = await Storage.syncGet('locale');
        self.url = ApiClient.userCodes() + '?locale=' + (locale || (DEFAULT_LANGUAGE + '_' + DEFAULT_COUNTRY));

        Storage.get(this.updateFlag, function (timeLastUpdated) {
                if (!timeLastUpdated || _.now() - timeLastUpdated > UPDATE_INTERVAL_CODES || force) {
                    Backbone.Collection.prototype.fetch.call(self, {reset: true}).always(function () {
                        Storage.set(self.updateFlag, _.now());
                    });
                } else {
                    Storage.get(self.flag, function (codes) {
                        if (_.isObject(codes)) {
                            self.set(codes);
                        } else if (!codes) {
                            Storage.set(self.updateFlag, 0);
                            _callee.apply(self, arguments);
                        }
                    });
                }
                if (!!self.fetchTimeout) {
                    window.clearTimeout(self.fetchTimeout);
                    self.fetchTimeout = null;
                }
                self.fetchTimeout = window.setTimeout(function () {
                    _callee.apply(self, arguments);
                }, UPDATE_INTERVAL_CODES);
            }
        );
    },

    parse: function (response) {
        if (response != null) {
            return response;
        } else {
            return null;
        }
    }
});
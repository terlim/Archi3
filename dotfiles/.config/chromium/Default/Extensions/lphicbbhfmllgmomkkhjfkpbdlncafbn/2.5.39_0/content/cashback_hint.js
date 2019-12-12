var CashbackHint = BackboneContent.View.extend({
    id: "letyshops-cashback-hint",
    template: Handlebars.templates.delivery_hint,

    initialize: function (options) {
        this.options = options;
    },

    render: function () {
        this.$el.empty().append($(this.template()));

        $(this.options.element).append(this.$el);

        if (!$.contains(window.document, this.el)) {
            this.$el.fadeIn(100);
        }

        return this;
    }
});
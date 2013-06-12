Inovout.Widget.Tip = Class.create(Inovout.View, {
    initialize: function ($super,dom) {
        $super(dom);
        return this;
    },
    getText: function () {
        return this.element.text();
    },
    setText: function (text) {
        this.element.text(text);
    }
});
Inovout.View.factories[".tip"] = Inovout.Widget.Tip;

inits["tip"] = Inovout.View.init;
Inovout.Widget.Tip = Tip = Class.create({
    initialize: function (dom) {
        this.element = Element.get(dom);
        return this;
    },
    getText: function () {
        return this.element.jqDom.text();
    },
    setText: function (text) {
        this.element.jqDom.text(text);
    }
});

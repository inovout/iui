var Element = Class.create({
    initialize: function (dom) {
        this.init(dom);
        this.click = new Event("click", this);
        var me = this;
        this.bind("click", function (event) {
            me.click.fire(owner, event);
        });
    },
    getClassName: function () {
        return this[0].className;
    }
});
jQuery.extend(Element.prototype, jQuery.fn);
jQuery.extend(Element, {
    cache: {},
    get: function (dom) {
        if (typeof dom == "string") {
            dom = document.getElementById(dom);
        }
        return Element.cache[dom] || new Element(dom);
    }
});
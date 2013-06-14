Inovout.Widget.TextBpx = Class.create(Inovout.View, {
    initialize: function ($super,dom) {
        $super(dom);
        return this;
    },
    getPlaceholder: function () {
        return this.element.prop("placeholder");
    },
    setPlaceholder: function (text) {
        this.element.prop("placeholder",text);
    }
});

//Inovout.View.TextBpx= (function (props) {

//})('search tel url email datetime date month week time datetime-local number range color'.split(' '));
Inovout.View.factories.TextBox = function (element) {
    function (element) {
        return element.find("input[type=text]","input[type=tel]");
    }
    return element.hasClass("tip");
};
Inovout.View.inits["TextBpx"] = function (element) {
    alert(1);

    debugger;
    return element.find("input[type=text]","input[type=tel]");
};
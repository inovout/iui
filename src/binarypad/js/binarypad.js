Inovout.Widget.BinaryPad = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.navs = Inovout.Element.get(document).find(".binaryPad-nav>span");
        this.articles = element.children("article");
        var me = this;
        this.navs.each(function (nav) {
            nav.click.addListener(function (sender, args) {
                me.navs.each(function (n) {
                    n.toggle();
                });
                me.articles.each(function (a) {
                    a.toggle();
                });

            });
        });
    }
});
$(function () {
    $(".binaryPad").each(function (i, dom) {
        Inovout.View.get(dom);
    });
});
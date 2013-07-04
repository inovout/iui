Inovout.Widget.Wizard = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.navs = element.find("nav>span");
        this.articles = element.find("div>article");
        this.currentArticle = 0;
        var me = this;
        this.navs[0].click.addListener(function (sender, args) {
            me.currentArticle--;
            me.show(me.currentArticle);
            if (me.currentArticle < me.articles.length - 1) {
                me.navs[1].css("visibility", "visible");
            }
            if (me.currentArticle == 0) {
                me.navs[0].css("visibility", "hidden");
            }
        });
        this.navs[1].click.addListener(function (sender, args) {
            me.currentArticle++;
            me.show(me.currentArticle);
            if (me.currentArticle > 0) {
                me.navs[0].css("visibility", "visible");
            }
            if (me.currentArticle == me.articles.length - 1) {
                me.navs[1].css("visibility", "hidden");
            }
        });
        if (this.navs.length > 2) {
            this.navs[2].click.addListener(function (sender, args) {
                me.currentArticle = me.articles.length - 1;
                me.show(me.currentArticle);
            });
        }
    },
    show: function (i) {
        this.articles.each(function (item) { item.hide(); });
        this.articles[i].show();
    }
});
$(function () {
    $(".wizard").each(function (i, dom) {
        Inovout.View.get(dom);
    });
});
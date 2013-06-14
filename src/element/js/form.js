Inovout.Element.Form = Class.create(Inovout.Element,{
    initialize: function ($super,dom) {
        $super(dom);
        this.uid = dom.uid;
    },
    toString: function () {
        return this.uid;
    }
});


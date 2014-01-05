Inovout.HAML = {};
Inovout.HAML.EventAdapter = Class.create({
    initialize: function (event, buildFunction) {
        this.event = event;
        buildFunction = buildFunction || Function.build;
        this.buildFunction = buildFunction;
        return this;
    },
    listen: function (sender, args) {
        this.buildFunction("sender,args", this.fnExpression).call(this.scope, sender, args);
    },
    addListener: function (fnExpression, scope, options) {
        this.fnExpression = fnExpression;
        this.scope = scope;
        this.event.addListener(this.listen, this, options);
    }
});

Inovout.HAML.EncryptInput = Class.create({
    initialize: function (element) {
        var name = element.attr("name");
        var reg_pk = element.data("encrypt").split("|");
        //去除element的name属性 
        element.removeAttr("name");
        //添加同名隐藏域
        var hiden = $("<input type='hidden' name=" + name + " />");
        element.append(hiden);
        //订阅元素的change事件
        element.change.addListener(function (sender, args) {
            var inputValue = element.val();
            var rsa = new RSAKey();
            rsa.setPublic(reg_pk[0], reg_pk[1]);
            hiden.val(rsa.encrypt(inputValue));
        });
        return this;
    }
})

Inovout.HAML.CommandBinder = Class.create(Inovout.HAML.EventAdapter, {
    initialize: function ($super, event, buildFunction) {
        $super(event, buildFunction);
        return this;
    }
});
Inovout.Controls.Form = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        var asyncSubmit = element.data("async");
        if (asyncSubmit) {
            this.submitCallback = Function("resp",asyncSubmit);
            element.complete(element.submit, function (event) {
                if (!event.defaultPrevented) {

                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
        return this;
    },
    submit: function () {
        //enctype
        //创建Request,通过enctype来指定请求体的格式。暂只支持JSON
    }
});
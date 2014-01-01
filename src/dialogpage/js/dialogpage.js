var DialogPage = Class.create(Page, {
    initialize: function ($super, element) {
        $super(element);
        return this;
    },
    run: function ($super) {
        //为form表单添加data-async属性

        //为form表单添加data-submit-command属性

        //执行父类中的方法
        $super();
    },
    submitCallBack: function () {
        //将需要返回的值发送给Dialog
    }
});
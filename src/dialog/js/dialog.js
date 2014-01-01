Inovout.Widgets.Dialog = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        //监听windows 的onmessage事件
        return this;
    },
    callBackMethod: method,
    saveCallBackMethod: function (functionName) {
        //保存回调方法名
        callBackMethod = arguments[0];
    },
    done: function (args) {
        //执行回调方法
    }
});
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

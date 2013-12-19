Inovout.XAML.EncryptInput = Class.create({
    initialize: function (element) {
        var name = element.attr("name");
        var reg_pk = element.data("encrypt");
        //去除element的name属性 
        element.removeAttr("name");
        //添加同名隐藏域
        var hiden = $("<input type='hidden' name=" + name + " />");
        element.append(hiden);

        //订阅元素的change事件
        element.change.addListener(function (sender, args) {
            var inputValue = element.val();
            var itemEncrypted = cryptico.encrypt(inputValue, reg_pk);
            hiden.text(itemEncrypted.cipher);
        });
        return this;
    }
})
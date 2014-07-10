Inovout.HAML.EncryptInput = Class.create({
    initialize: function (element) {
        var name = element.attr("name");
        var reg_pk = element.data("encrypt").split("|");
        //去除element的name属性 
        element.removeAttr("name");
        //添加同名隐藏域
        var hiden = $("<input type='hidden' name=" + name + " />");
        element.after(hiden);
        //订阅元素的change事件
        var formElement = Inovout.Element.get(element.parents("form"));
        formElement.submit.addListener(function (sender, args) {
            var inputValue = element.val();
            var rsa = new RSAKey();
            rsa.setPublic(reg_pk[0], reg_pk[1]);
            hiden.val(rsa.encrypt(inputValue));
        });
        return this;
    }
})

Inovout.HAML.Parsers.EncryptInputParser = {
    parse: function (scopeElement) {
        scopeElement.find("[data-encrypt]").each(function (dedElement) {
            new Inovout.HAML.EncryptInput(dedElement);
        });
    }
}

Inovout.XAML.EncryptInput = Class.create({
    initialize: function (element) {
        var name = element.attr("name");
        var reg_pk = element.data("encrypt");
        element.removeAttr("name");
        var hiden = $("<input type='hidden' name=" + name + " />");
        element.append(hiden);
        element.change.addListener(function (sender, args) {
            var inputValue = element.val();
            var itemEncrypted = cryptico.encrypt(inputValue, reg_pk);
            hiden.val(itemEncrypted.cipher);
        });
        return this;
    }
});
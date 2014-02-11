Inovout.Widgets.Form = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        Object.extend(this, element);
        var me = this,
            asyncSubmit = element.data("async");
        if (asyncSubmit) {
            element.complete(element.submit, function (event) {
                if (!event.defaultPrevented) {
                    event.preventDefault();
                    event.stopPropagation();
                    _submit(asyncSubmit);
                }
            });

            //替换FileInput
            element.find("input[type=file]").each(function (file) {
                var fiDom = $("<div class=\"fileInput\"><button type=\"button\" class=\"fileInput_browse_button\">浏览</button></div>")[0];
                file.replaceWith(fiDom);
                Inovout.View.get(fiDom);
            });
        }
        function _submit(callback) {
            var uri = new Uri(element.prop("action")),
                data = element.serializeJSON(),
                request = new HttpRequest(element.prop("method"), uri),
                content, client = new HttpClient();
            enctype = element.attr("enctype") || "application/x-www-form-urlencoded";

            if (uri.uri.indexOf("[") > 0) {
                for (name in data) {
                    uri.uri = uri.uri.replace(new RegExp("\\[" + name + "\\]", "ig"), data[name]);
                }
            }

            if (request.method == "post") {
                if (enctype == "application/x-www-form-urlencoded") {
                    content = new JsonContent(data);
                } else if (enctype == "multipart/related") {
                    var boundary = "iui_" + ("" + Math.random()).replace(/\D/g, "");
                    content = new MultipartContent("related", boundary);
                    content.add(new JsonContent(data));
                    element.find(".fileInput").each(function (file) {
                        content.add(new FileContent(Inovout.View.get(file.fileInput.files[0])));
                    });
                }
                request.content = content;
            }
            client.send(request).read().done(function (data) {
                Inovout.View.buildFunction("data", callback).call(me, data);
                //me.submit.fire(me, data);
            });
        }

        return this;
    }
});

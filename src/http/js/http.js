$.ajaxSetup({
    error: function () {
        alert("出现异常！请联系管理员！");
    }
});
Uri = Class.create({
    initialize: function (uri) {
        this.uri = uri;
        return this;
    },
    paras: [],
    add: function (para) {
        this.paras.pash(para);
    },
    build: function () {
        return this.uri;
    }
});
HttpClient = Class.create({
    initialize: function () {
        return this;
    },
    send: function (request, callback) {
        return request.execute();
    },
    get: function (url) {
        return this.send(new HttpRequest("get", url));
    },
    getJson: function () {
        return this.send(new HttpRequest("get", url), Object.toJson);
    },
    post: function (uri, content) {
        return this.send(new HttpRequest("post", url, content));
    }
});
HttpRequest = Class.create({
    initialize: function (method, uri) {
        this.method = method.toLowerCase();
        this.uri = uri;
        return this;
    },
    execute: function () {
        if (!Object.isString(this.uri)) {
            this.uri = this.uri.build();
        }
        var me = this,
        response = new HttpResponse(this),
        options = {
            type: this.method,
            headers: {}
        };
        if (this.method == "get") {

        } else if (this.method == "post") {

        }
        if (this.content) {
            Object.extend(options.headers, this.content.headers);
            this.content.read().done(function () {
                options.data = me.content.result;
                response.setXHR($.ajax(me.uri, options));
            });
        } else {
            response.setXHR($.ajax(this.uri, options));
        }
        return response;
    }
});

HttpResponse = Class.create({
    initialize: function (request, xhr) {
        this.request = request;
        if (xhr) {
            this.setXHR(xhr);
        }
        return this;
    },
    setXHR: function (xhr) {
        var me = this;
        this.xhr = xhr;
        this.xhr.done(function (data) {
            debugger;
            me.deferred.resolveWith(xhr,[data]);
        });
    },
    read: function () {
        this.deferred = $.Deferred();
        return this.deferred.promise();

    }
});
HttpContent = Class.create({
    initialize: function (data) {
        this.data = data;
        this.headers = [];
        return this;
    },
    addHeader: function (name, value) {
        this.headers[name] = value;
    }
});
JsonContent = Class.create(HttpContent, {
    initialize: function ($super, json) {
        $super(json).addHeader("Content-Type", "application/json");
    },
    read: function () {
        var deferred = $.Deferred();
        this.result = Object.toJSON(this.data);
        deferred.resolve();
        return deferred.promise();
    }
});
FileContent = Class.create(HttpContent, {
    initialize: function ($super, file) {
        var base = $super(file.fileInput.files[0]);
        base.addHeader("Content-Type", this.data.type || "application/octet-stream");
        //base.addHeader("Content-Transfer-Encoding", "base64");
    },
    read: function () {
        var me = this,
            deferred = $.Deferred(),
            reader = new o.FileReader();
        reader.onload = function () {
            me.result = reader.result;
            //this.result = String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(reader.result)));
            deferred.resolve();

        };
        reader.readAsBinaryString(this.data);

        //reader.readAsArrayBuffer(this.file.dom);
        //reader.readAsBinaryString(this.file.dom);
        //reader.onload = function (e) {
        //    base64Data = ;
        //};
        return deferred.promise();
    }
});
MultipartContent = Class.create(HttpContent, {
    initialize: function ($super, subtype, boundary) {
        this.boundary = boundary;
        this.subtype = subtype;
        $super().addHeader("Content-Type", "multipart/" + subtype + "; boundary=" + boundary);
        this.contents = [];
    },
    add: function (content) {
        this.contents.push(content);
    },
    read: function () {
        var deferred = $.Deferred();

        var header,
            me = this,
            data = "",
            reads = [];
        me.contents.each(function (content) {
            reads.push(content.read());
        });
        $.when.apply($, reads).then(function () {
            me.contents.each(function (content) {
                data = data + "--" + me.boundary + "\r\n";
                for (header in content.headers) {
                    if (typeof content.headers[header] == "string") {
                        data = data + header + ": " + content.headers[header] + "\r\n";
                    }
                }
                data = data + "\r\n" + content.result + "\r\n";
            });
            data = data + "--" + me.boundary + "--\r\n";
            me.result = data;
            deferred.resolve();
        });

        return deferred.promise();
    }
});

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
        this.paras.push(para);
    },
    build: function () {
        var paramStr="";
        var index = this.uri.indexOf('?');
        for (var i = 0; i < this.paras.length; i++) {
            var tmpStr = null;
            for (prop in this.paras[i]) {
                tmpStr = prop + "=" + this.paras[i][prop];
            }
            if (i == 0 && index == -1) {
                paramStr += "?" + tmpStr;
            } else {
                paramStr += "&" + tmpStr;
            }     
        }
        this.uri += paramStr;
        return this.uri;
    }
});
HttpClient = Class.create({
    initialize: function () {
        return this;
    },
    send: function (request) {
        return request.execute();
    },
    get: function (url) {
        return this.send(new HttpRequest("get", url));
    },
    getJson: function (uri) {
        return this.send(new HttpRequest("get", uri));
    },
    post: function (uri, content) {
        return this.send(new HttpRequest("post", uri, content));
    },
    postFile: function (uri, file) {
        return this.post(uri, new FileContent(file));
    },
    postJson: function (uri, json) {
        return this.post(uri, new JsonContent(json));
    }
});
HttpRequest = Class.create({
    initialize: function (method, uri, content) {
        this.method = method.toLowerCase();
        this.content = content;
        this.uri = uri;
        return this;
    },
    execute: function () {
        
        if (!Object.isString(this.uri)) {
            this.uri = this.uri.build();
        }
        this.uri = encodeURI(this.uri);
        var me = this, response = new HttpResponse(this);
        if (!$.support.cors) {
            if (this.method == "delete") {
                this.method = "get";
                addUrlQuery("http-method=delete");
            }
            if (this.method == "put") {
                this.method = "post";
                addUrlQuery("http-method=put");

            }
        }
        function addHttpMethodQuery(h) {
            if (me.uri.indexOf("?") > -1) {
                me.uri = me.uri + "&@" + h;
            }
            else {
                me.uri = me.uri + "?@" + h;
            }
        }
        var options = {
            type: this.method,
            //dataType: "jsonp",
            headers: {}
        };

        if (this.content) {
            Object.extend(options.headers, this.content.headers);
            this.content.read().done(function () {
                options.data = me.content.result;
                if (!$.support.cors) {
                    for (h in options.headers) {
                        addUrlQuery(h + "=" + options.headers[h]);
                    }
                }

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
            
            me.deferred.resolveWith(xhr, [data]);
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
        var base = $super(file);
        base.addHeader("Content-Type", this.data.type || "application/octet-stream");
        base.addHeader("Content-Transfer-Encoding", "base64");
    },
    read: function () {
        var me = this,
            deferred = $.Deferred(),
            reader = new o.FileReader();
        reader.onload = function () {
            me.result = btoa(reader.result);
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

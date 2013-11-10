//debugger;

Uri = Class.create({
    initialize: function (element) {
        return this;
    },
    add: function (item) {
        this.element.append("<option value=\"" + item.value + "\">" + item.value + "</option>");
    }
});
HttpClient = Class.create({
    initialize: function (element) {
        return this;
    },
    send: function (request,convert) {
        return request.execute().getResult(convert);
    },
    get: function (url) {
        return this.send(new HttpRequest("get", url));
    },
    getJson: function () {
        return this.send(new HttpRequest("get", url), Object.toJson);
    },
    post: function (uri, content) {
        return this.send(new HttpRequest("post", url,content));
    }
});
HttpRequest = Class.create({
    initialize: function (method, uri) {
        this.method = method;
        this.uri = uri;
        return this;
    },
    execute: function () {
        var options = {
            url: this.url,
            type: this.method
        }
        if (this.method == "get") {

        } else if (this.method == "post") {

        }
        return new HttpResponse(this, $.ajax(options));
    }
});

HttpResponse = Class.create({
    initialize: function (request, jqXHR) {
        this.request = request;
        this.jqXHR = jqXHR;
        return this;
    },
    add: function (item) {
        this.element.append("<option value=\"" + item.value + "\">" + item.value + "</option>");
    }
});
HttpContent = Class.create({
    initialize: function (element) {
        return this;
    },
    add: function (item) {
        this.element.append("<option value=\"" + item.value + "\">" + item.value + "</option>");
    }
});

StreamContent = Class.create(HttpContent, {
    initialize: function ($super, element) {
        $super(element);
    }
});

var response,client = new HttpClient();
response = client.get("http://www.baidu.com");
response = client.post("http://www.baidu.com");
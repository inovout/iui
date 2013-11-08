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
    send: function (data) {
    },
    get: function (selectedItem) {
    },
    getJson: function () {
    },
    post: function () {
    }
});
HttpRequest = Class.create({
    initialize: function (uri, method, paras) {
        return this;
    },
    execute: function () {
    }
});

HttpResponse = Class.create({
    initialize: function (element) {
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

var client = new HttpClient("http://www.baidu.com");
var response = client.get();
client = new HttpRequest("http://www.baidu.com");
response = client.post("test");
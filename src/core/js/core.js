var inits = Inovout = {};
Object.extend(Object, {
    isObject: function (obj) {
        return Object(obj) === obj;
    }
});
iui = (function (window, document, undefined) {
    var scripts = document.getElementsByTagName("script")
    var loaderScript = scripts[scripts.length - 1];
    var dataConfig = loaderScript.getAttribute("data-config")
    var dataMain = loaderScript.getAttribute("data-main")
    yepnope(
        {
            test: !!dataConfig,
            yep: dataConfig,
            complete: loadModule
        }
    );
    function loadModule() {
        yepnope({
            load: [configData.name2path["class"]],
            complete: loadMain
        });
    }

    function loadMain() {
        if (!!dataMain) {
            yepnope(dataMain);
        }
    }

    var configData = {
        modules: {},
        name2path: {},
        path2name: {}
    };
    function define(data) {
        if (Object.isObject(data)) {
            configData.modules[data.name] = data;
            configData.name2path[data.name.toLowerCase()] = data.path;
            configData.path2name[data.path.toLowerCase()] = data.name;
        }
    }
    function require() { }
    return {
        define: define
    };
})(this, this.document);



//main $(function)=$(document).ready(function)
//想方法订阅document.load事件，目前是与jQery绑定
//jQuery(function () {
//    for (initKey in inits) {
//        inits[initKey](initKey);
//    }
//});


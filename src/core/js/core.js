var inits = Inovout = {};
Object.extend(Object, {
    isObject: function (obj) {
        return Object(obj) === obj;
    }
});
Object.extend(Class, {
    get: function (componentName) {
        //先在Window模型去找
        //去iui.components去找，若有且未加载，则加载对应的module，在加载完成之后，将构造函数返回。
        return componentName;
    }
});
iui = (function (window, document, undefined) {
    /*
    1、获取dataConfig和dataMain信息，若data-config没设置，则默认为script的path（去除文件名），拼接"config.js"；data-main不设置时，则自身即为main。
    2、加载config.js，加载完成后，通过调用iui.define定义modules和components，注意使用array.prototype扩展方法来简化代码。
    3、若有dataMain，则在config加载完成事件中加载dataMain及其所有关联module（注意是通过component迭代遍历过滤）。若没有参照1
    4、在dataMain加载完成（包括没有dataMain），预加载所有未加载的module。当然，这里需有一个优先级设置。
    path都是相对core.js的路径。
    注意事项：
    1、module通过是否加载属性和component通过是否加载方法（实际返回对应的module的是否加载属性）
    2、对于loaded事件仍需进一步完善设计，主要是接口定义。
    3、Class提供get方法，通过FullName在所有组件查询，若没有加载，由立即加载，加载完成返回该构造函数。
    4、所有预加载module必须在window.loaded之后（以避影响DOM的资源加载，如：IMG），每隔2S加载一个module,而且是依次加载，以避免与AJAX或HTTP METHOD抢连接资源。
    */
    var scripts = document.getElementsByTagName("script")
    var loaderScript = scripts[scripts.length - 1];
    var dataConfig = loaderScript.getAttribute("data-config")
    var dataMain = loaderScript.getAttribute("data-main")
    yepnope(
        {
            test: !!dataConfig,
            yep: dataConfig,
            complete: loadMain
        }
    );

    function loadMain() {
        if (!!dataMain) {
            var mainModule = configData.pathModules[dataMain] || configData.nameModules[dataMain];
            var paths = [];
            var callbacks = {};
            mainModule.components.each(function (component) {
                var mods = getDependentModule(component);
                for (var i = mods.length - 1; i > -1; i--) {
                    mod = mods[i];
                    var path = mod.path;
                    if (paths.indexOf(path) == -1) {
                        paths.push(path);
                        component.module.depens.push(mod.name);
                        if (!!mod.loaded) {
                            callbacks[path] = function (path) {
                                var components = [];
                                configData.pathModules[path].components.each(function (c) {
                                    getDependentComponents(c, components)
                                });
                                Function("components,loader", mod.loaded + "(components,loader);")(components, load);
                            }
                        }
                    }
                }
            });
            paths.push(mainModule.path);
            yepnope({
                load: paths,
                callback: callbacks
            });
            paths.each(function (path) {
                configData.pathModules[path.toLowerCase()].isLoad = true;
            });
        }
    }
    function getDependentComponents(component, ret) {
        if (!component) { return ret; }
        if (Object.isString(component)) {
            component = configData.nameComponents[component];
        }
        ret = ret || [];
        configData.modules.each(function (mod) {
            mod.components.each(function (refComponent) {
                if (!!refComponent.depens && refComponent.depens.indexOf(component.name) > -1) {
                    ret.push(refComponent);
                    getDependentComponents(refComponent, ret)
                }
            });
        });
        return ret;

    }
    function load(components, callbackArgs) {
        var needs = [];
        var cneeds = {};
        components.each(function (c) {
            var need = cneeds[c.name] || {};
            if (!!c.test) {
                need.test = need.test || c.test.call(this, callbackArgs);
            }
            if (!cneeds[c.name]) {
                need.yep = c.module.path;
                needs.push(need);
            }
        });
        yepnope(needs);
    }
    function getDependentModule(component, ret) {
        if (!component) { return ret; }
        if (Object.isString(component)) {
            component = configData.nameComponents[component];
        }
        if (!component.depens) { return ret; }

        ret = ret || [];
        component.depens.each(function (dep) {
            var depComponent = configData.nameComponents[dep];
            ret.push(depComponent.module);
            getDependentModule(depComponent, ret)
        });
        return ret;
    }
    $(window).ready(function () {
        //加载未加载的module，注意先加载有test条件的module.
    });
    //先暂时依赖jQuery
    function main(fn) {
        $(document).ready(fn);
    }

    var configData = {
        modules: [],
        components: [],
        nameComponents: {},
        nameModules: {},
        pathModules: {}
    };
    function define(data) {
        if (Object.isObject(data)) {
            data.depens = [];
            configData.modules.push(data);
            configData.nameModules[data.name] = data;
            configData.pathModules[data.path.toLowerCase()] = data;
            if (!data.components) {
                data.components = [];
                data.components.push({ name: data.name, module: data });
            }
            data.components.each(function (compnent) {
                compnent.module = data;
                configData.components.push(compnent);
                configData.nameComponents[compnent.name] = compnent;
            });
        }
    }
    function require() { }
    return {
        define: define,
        main: main
    };
})(this, this.document);
var basePath,
    iui = (function () {
    //config.js加载后的数据结构
    var configData = {
        modules: [],
        components: [],
        nameComponents: {},
        //nameModules: {},
        pathModules: {}
    };
    /**
     * 解析每个data对象，根据不同的属性存储为configData相应的数据结构，
     * 方便后续loadComponents时的查找行为。
     * @param data config.js中定义的data数据
     * 例如：
     * {
            name: "page",
            path: "../src/page/js/page.js",
            components: [
            {
                name: "Page",
                depens: ["Inovout.View"]
                }]
        }
     */
    var context = { status: "loading" };
    function hasClass(c) {
        return document.getElementsByClassName(c).length > 0;
    }
    function hasTag(tag) {
        return document.getElementsByTagName(tag).length > 0;
    }
    function hasAttr(tag, attr) {
        var elems = document.getElementsByTagName(tag);
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].getAttribute(attr)) {
                return true;
            }
        }
        return false;
    }
    return {
        configData: configData,
        context: context,
        hasClass: hasClass,
        hasTag: hasTag,
        hasAttr: hasAttr,
        load: undefined
    };
})();

function define(data) {
    if (basePath && data.path.substr(0,4)!="http") {
        basePath = basePath.substr(basePath.length - 1) == "/" ? basePath.substr(0, basePath.length - 1) : basePath;
        data.path = basePath + data.path;
    }
    var configData = iui.configData;
    data.depens = [];//设置data.depens为空数组
    configData.modules.push(data);//将data数据添加到全局变量configData.modules中。
    //configData.nameModules[data.name] = data;//添加data.name与data对应关系到configData.nameModules对象中
    configData.pathModules[data.path] = data;//添加data.path与data对应关系到configData.pathModules对象中
    //最原始的data中没有依赖任何js所以需要此判断
    if (!data.components) {
        data.components = [];
        //没有依赖任何module的话data.components的name为data.name，module为自身data
        data.components.push({ name: data.name, module: data });
    }
    //遍历data.components 将每个componet存入configData.components,
    // 并对应的添加compnent.name:compnent到nameComponents
    for (var i = 0; i < data.components.length; i++) {
        var compnent = data.components[i];
        //向每个compnent对象加入module属性，module的值为自身data
        compnent.module = data;
        //添加compnent到全局变量configData.components数组中
        configData.components.push(compnent);
        //添加compnent.name与compnent对应关系到configData.nameComponents对象中
        configData.nameComponents[compnent.name] = compnent;
    }

};

(function () {
    /*
     1、获取dataConfig和dataEntry信息，若data-config没设置，则默认为script的path（去除文件名），拼接"config.js"；data-main不设置时，则自身即为main。
     2、加载config.js，加载完成后，通过调用iui.define定义modules和components，注意使用array.prototype扩展方法来简化代码。
     3、若有dataEntry，则在config加载完成事件中加载dataEntry及其所有关联module（注意是通过component迭代遍历过滤）。若没有参照1
     4、在dataEntry加载完成（包括没有dataEntry），预加载所有未加载的module。当然，这里需有一个优先级设置。
     path都是相对core.js的路径。
     注意事项：
     1、module通过是否加载属性和component通过是否加载方法（实际返回对应的module的是否加载属性）
     2、对于loaded事件仍需进一步完善设计，主要是接口定义。
     3、Class提供get方法，通过FullName在所有组件查询，若没有加载，由立即加载，加载完成返回该构造函数。
     4、所有预加载module必须在window.loaded之后（以避影响DOM的资源加载，如：IMG），每隔2S加载一个module,而且是依次加载，以避免与AJAX或HTTP METHOD抢连接资源。
     */
    var configData = iui.configData;
    var scripts = document.getElementsByTagName("script");
    var loaderScript = scripts[scripts.length - 1];
    var dataConfig = loaderScript.getAttribute("data-config");

    if (!dataConfig) {
        var srcStr = loaderScript.getAttribute("src");
        dataConfig = srcStr.substring(0, srcStr.lastIndexOf("/") + 1) + "config.js";
    }

    var dataEntry = loaderScript.getAttribute("data-main");
    if (!dataEntry) {
        dataEntry = "Page";
    }

    //首先加载config.js
    injectJs(
        {
            load: dataConfig,
            complete: startApplication
        }
    );
    /**
     * 完成config.js的加载后执行此方法，
     * 根据依赖关系以LIFO(last-in，first-out)方式加载js模块
     */
    function startApplication() {
        iui.load = function (fn) {
            loadList.push(fn);
        };
        loadModule(["jQuery", dataEntry], function () {
            //加载所有有test的module
            loadTestComponents(configData.components, $(document));
            //预加载所有未加载的module
            $(window).ready(function () {
                loadPreloadModule();
            });
        });
    }
    function loadPreloadModule() {
        configData.modules.each(function (m) {
            if (!m.isLoad) {
                m.isLoad = true;
                injectJs(
                            {
                                load: "preload!" + m.path,
                                complete: loadPreloadModule
                            }
                    );
            }
        });
    }
    function loadModule(modules, loadCallback) {
        var allPaths = [];//需要加载的js文件列表
        var allCallbacks = {};//加载js过程中对应的回调函数
        if (typeof modules == "string") {
            getModulePathsAndCallbacks(modules, allPaths, allCallbacks);
        }
        else {
            var paths = [];
            var callbacks = {};
            for (var i = 0; i < modules.length; i++) {
                getModulePathsAndCallbacks(modules[i], allPaths, allCallbacks);
                for (var j = 0; j < paths.length; j++) {
                    var path = paths[j];
                    if (allPaths.indexOf(path) == -1) {
                        allPaths.push(path)
                        allCallbacks[path] = callbacks[path];
                    }
                }
            }
        }
        injectJs({
            load: allPaths,
            callback: allCallbacks,
            complete: loadCallback
        });
        //设置为已加载
        for (var i = 0; i < allPaths.length; i++) {
            configData.pathModules[allPaths[i]].isLoad = true;
        };
    }

    function getModulePathsAndCallbacks(module, paths, callbacks) {
        if (typeof module == "string") {
            module = configData.pathModules[module] || configData.nameComponents[module].module;
        }
        //根据dataEntry从configData中获取data数据，注意pathModules中保存的是大写的字符串
        //遍历entryModule.components,获取每个component依赖的path
        for (var i = 0; i < module.components.length; i++) {
            var component = module.components[i];
            //递归方式获取依赖关系
            var mods = getDependentModule(component) || [];
            //从后往前添加js依赖
            for (var j = mods.length - 1; j > -1; j--) {
                mod = mods[j];
                var path = mod.path;
                //剔除重复的
                if (!mod.isLoad && paths.indexOf(path) == -1) {
                    paths.push(path);
                    //将依赖的depens都追加到depens数组中
                    component.module.depens.push(mod.name);
                    //if (mod.loaded) {
                    //    //定义callbacks
                    //    callbacks[path] = function (path) {
                    //        var components = [];
                    //        configData.pathModules[path].components.each(function (c) {
                    //            getDependentComponents(c, components)
                    //        });
                    //        Function("components,loader", mod.loaded + "(components,loader);")(components, load);
                    //    }
                    //}
                }
            }
        }

        //entryModule等自身依赖的js全部加载完成后再进行加载
        paths.push(module.path);

    }

    function loadTestComponents(components, testFunctionArgs) {
        testFunctionArgs.find(".tabList");
        var paths = [];
        components.each(function (c) {
            var path = c.module.path;
            if (!c.module.isLoad && paths.indexOf(path) == -1) {
                if (c.test) {
                    var need = c.test == true;
                    need = need || (typeof c.test == "function" && c.test.call(this, testFunctionArgs));
                    if (need) {
                        paths.push(path);
                    }
                }
            }
        });
        loadModule(paths, function () {
            loadList.each(function (fn) {
                $(document).ready(fn);
            });
            iui.load = function (fn) {
                $(document).ready(fn);
            };
            iui.context.status = "loaded";
        });
    }
    var loadList = [];

    /**
     * 动态加载js的工具
     */
    function injectJs(loadObject) {
        yepnope(loadObject);
    }

    /**
     *
     * @param component config.js中定义的components数组中的第n个
     * @param ret 递归完成后返回的值
     * @returns {*}
     */
    function getDependentModule(component, ret) {
        if (!component) {
            return ret;
        }

        //如果component没有依赖了则返回
        if (!component.depens) {
            return ret;
        }

        ret = ret || [];

        //遍历component.depens,从name与Components对应关系中获取component,并递归查找
        for (var i = 0; i < component.depens.length; i++) {
            var depComponent = configData.nameComponents[component.depens[i]];
            ret.push(depComponent.module);
            getDependentModule(depComponent, ret)
        };
        return ret;
    }

})();
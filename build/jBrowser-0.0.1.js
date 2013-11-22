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
        var context = {};
        function hasClass(c) {
            return document.getElementsByClassName(c).length > 0;
        }
        function hasTag(tag) {
            return document.getElementsByTagName(tag).length > 0;
        }
        function hasAttr(tag, attr, value) {
            var elems = document.getElementsByTagName(tag);
            for (var i = 0; i < elems.length; i++) {
                if (value) {
                    if (elems[i].getAttribute(attr) == value) {
                        return true;
                    }
                }
                else {
                    if (elems[i].getAttribute(attr)) {
                        return true;
                    }
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
    if (basePath && data.path.substr(0, 4) != "http") {
        basePath = basePath.substr(basePath.length - 1) == "/" ? basePath.substr(0, basePath.length - 1) : basePath;
        data.path = basePath + data.path;
    }
    var component,
        configData = iui.configData;
    data.depens = [];//设置data.depens为空数组
    configData.modules.push(data);//将data数据添加到全局变量configData.modules中。
    //configData.nameModules[data.name] = data;//添加data.name与data对应关系到configData.nameModules对象中
    configData.pathModules[data.path] = data;//添加data.path与data对应关系到configData.pathModules对象中
    //最原始的data中没有依赖任何js所以需要此判断
    if (!data.components) {
        //没有依赖任何module的话data.components的name为data.name，module为自身data
        data.components = [];
    }
    $.extend(component = {}, data);
    data.components.push(component);
    //遍历data.components 将每个componet存入configData.components,
    // 并对应的添加compnent.name:compnent到nameComponents
    for (var i = 0; i < data.components.length; i++) {
        compnent = data.components[i];
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
    var configData = iui.configData, loadList = [],
        head = document.head || $("head")[0] || document.documentElement,
        scripts = document.getElementsByTagName("script"),
        loaderScript = scripts[scripts.length - 1],
        dataConfig = loaderScript.getAttribute("data-config"),
        dataEntry = loaderScript.getAttribute("data-entry") || "Page",
        dataPreload = loaderScript.getAttribute("data-preload");
    //修改jquery异步加载JS的功能。
    head._insertBefore = head.insertBefore;
    head.insertBefore = function () {
        //针对跨域加载JS
        arguments[0].async = false;
        head._insertBefore.apply(head, arguments);
    }
    if (!dataConfig) {
        var srcStr = loaderScript.getAttribute("src");
        dataConfig = srcStr.substring(0, srcStr.lastIndexOf("/") + 1) + "config.js";
    }
    //首先加载config.js
    injectJs(dataConfig, startApplication);

    /**
     * 动态加载js的工具
     */
    function injectJs(scripts, complete, failure) {
        if (typeof scripts == "string") {
            scripts = [{ path: scripts }];
        }
        var loader = [];
        $(scripts).each(function (i, src) {
            $.extend(src, {
                components: null,
                type: "get",
                async: false,
                cache: true,
                crossDomain: true,
                dataType: "script"
            });
            loader.push($.ajax(src.path, src));
        });
        $.when.apply($, loader).then(complete, failure);
    }
    /**
     * 完成config.js的加载后执行此方法，
     * 根据依赖关系以LIFO(last-in，first-out)方式加载js模块
     */
    function startApplication() {
        iui.load = function (fn) {
            loadList.push(fn);
        };
        var modules = getModules(dataEntry);
        //加载所有有test的module
        modules = uniqueArray(modules.concat(modules, getTestModules(configData.components, $(document))));
        modules = modules.filter(function (module) {
            return !module.required || (modules.indexOf(configData.pathModules[module.required]) > -1);
        });
        injectJs(modules, function () {
            head.insertBefore = head._insertBefore;

            iui.load = function (fn) {
                $(document).ready(fn);
            };
            $(document).ready(loadList);

            //预加载所有未加载的module
            $(window).ready(function () {
                loadPreloadModule();
            });
        });
    }
    function loadPreloadModule() {
        if (!dataPreload) {
            return;
        }
        configData.modules.each(function (m) {
            if (!m.isLoad) {
                m.isLoad = true;
                $("<img />").attr("src", m.path);
                setTimeout(loadPreloadModule, 100);
            }
        });
    }
    function getModules(modules) {
        if (typeof modules == "string") {
            modules = [configData.pathModules[modules] || configData.nameComponents[modules].module];
        }
        var ret = [];
        for (var i = 0; i < modules.length; i++) {
            ret = ret.concat(getDependentModules(modules[i]));
        }
        return uniqueArray(ret);
    }
    function uniqueArray(arr) {
        var a = arr.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }
    function getDependentModules(module) {
        if (typeof module == "string") {
            module = configData.pathModules[module] || configData.nameComponents[module].module;
        }
        var i, j, ret = [];
        //根据dataEntry从configData中获取data数据，注意pathModules中保存的是大写的字符串
        //遍历entryModule.components,获取每个component依赖的path
        for (i = 0; i < module.components.length; i++) {
            var component = module.components[i];
            //递归方式获取依赖关系
            var mods = getDependentModule(component) || [];
            //从后往前添加js依赖
            for (j = mods.length - 1; j > -1; j--) {
                ret.push(mods[j]);
            }
        }
        //Module等自身依赖的js全部加载完成后再进行加载
        ret.push(module);
        return uniqueArray(ret);

    }

    function getTestModules(components, testFunctionArgs) {
        var i, c, ret = [];
        for (i = 0; i < components.length; i++) {
            c = components[i];
            if (!!c.test || (typeof c.test == "function" && c.test.call(this, testFunctionArgs))) {
                ret.push(c.module);
            }
        }

        return getModules(ret);
    };

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
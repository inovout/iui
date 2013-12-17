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
            return $("." + c).length > 0;
        }
        function hasTag(tag) {
            return $(tag).length > 0;
        }
        function hasAttr(tag, attr, value) {
            if (arguments.length == 2) {
                return $("[" + tag + "=" + attr + "]").length > 0;
            } else {
                return $(tag + "[" + attr + "=" + value + "]").length > 0;
            }
        }
        function getUri(url) {
            if (basePath && url.substr(0, 4) != "http") {
                basePath = basePath.substr(basePath.length - 1) == "/" ? basePath.substr(0, basePath.length - 1) : basePath;
                return basePath + url;
            }
            return url;
        }
        return {
            configData: configData,
            context: context,
            hasClass: hasClass,
            hasTag: hasTag,
            hasAttr: hasAttr,
            getUri: getUri,
            load: undefined
        };
    })();

function define(data) {
    data.path = iui.getUri(data.path);
    var component,
        configData = iui.configData;
    data.depens = data.depens || [];//设置data.depens为空数组
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
        head = $("head")[0],
        loaderScript = $("script:last"),
        dataConfig = loaderScript.data("config"),
        dataEntry = loaderScript.data("entry") || "Page",
        dataPreload = loaderScript.data("preload");

    if (!dataConfig) {
        var srcStr = loaderScript.getAttribute("src");
        dataConfig = srcStr.substring(0, srcStr.lastIndexOf("/") + 1) + "config.js";
    }
    if (basePath = dataConfig.match(/https?:\/\/[a-z0-9\-._~%]+:?[0-9]*/)) {
        basePath = basePath[0];
    }
    iui.load = function (fn) {
        loadList.push(fn);
    };


    //首先加载config.js
    injectJs(dataConfig, startApplication);

    /**
     * 动态加载js的工具
     * status :
     * 0 未加载
     * 1 需加载
     * 2 加载中
     * 3 加载完成
     */
    function injectJs(scripts, done, i) {
        if (!$.isArray(scripts)) {
            scripts = [{ path: scripts }];
        }
        if (!$.isNumeric(i)) {
            getScripts(scripts).done(function () {
                $.each(scripts, function (_, script) {
                    script.status = 3//loaded;
                });
                if (done) {
                    done.apply(this, arguments);
                }
            });
        } else {
            //setTimeout(function () {
            getScripts(scripts[i]).done(function () {
                scripts[i].status = 3//loaded;
                i++;
                if (scripts.length == i) {
                    done.apply(this.arguments);
                }
                else {
                    injectJs(scripts, done, i);
                }
            });
            //});
        }
    }

    function getScripts(scripts, done) {
        if (!$.isArray(scripts)) {
            scripts = [scripts];
        }
        var xhrs = $.map(scripts, function (script) {
            script.status = 2//loading;
            return $.ajax($.extend(script, {
                url: script.path,
                components: null,
                dataType: 'script',
                cache: true
            }));
        });
        return $.when.apply($, xhrs).done(done);
    }
    /**
    * 完成config.js的加载后执行此方法，
    * 根据依赖关系以LIFO(last-in，first-out)方式加载js模块
    */
    function startApplication() {
        var modules = getModules(dataEntry);
        //加载所有有test的module
        modules = uniqueArray(modules.concat(modules, getTestModules(configData.components, $(document))));
        modules = $.grep(modules, function (module) {
            if (module.required) {
                for (var i = 0; i < module.required.length; i++) {
                    if (configData.nameComponents[module.required[i]].module.status > 0) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        });
        injectJs(modules, function () {
            $(document).ready(loadList);
            iui.load = $(document).ready;
            //预加载所有未加载的module
            $(window).ready(function () {
                loadPreloadModule();
            });
        }, 0);//支持并行加载顺序执行
        //需修改？？暂时全部为顺序加载，顺序执行。/msie/.test(navigator.userAgent.toLowerCase()) ? undefined : 0
    }
    function getTestModules(components) {
        var i, c, ret = [], components = configData.components, modules;
        for (i = 0; i < components.length; i++) {
            c = components[i];
            if (!!c.test || (typeof c.test == "function" && c.test.call(this, $(document)))) {
                ret.push(c.module);
            }
        }
        return getModules(ret);
    }

    function loadPreloadModule() {
        if (!dataPreload) {
            return;
        }
        configData.modules.each(function (m) {
            if (!m.isLoad) {
                m.isLoad = true;
                $("<img />").attr("src", m.path);
                setTimeout(loadPreloadModule, 50);
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
            modules[i].status = 1;
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
                mods[j].status = 1;
            }
        }
        //Module等自身依赖的js全部加载完成后再进行加载
        ret.push(module);
        return uniqueArray(ret);

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
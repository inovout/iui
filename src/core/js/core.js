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
    var scripts = document.getElementsByTagName("script");
    var loaderScript = scripts[scripts.length - 1];
    var dataConfig = loaderScript.getAttribute("data-config");
    //2013-06-21 Add by hujing:若data-config没设置，则默认为script的path（去除文件名），拼接"config.js"
    var srcStr = loaderScript.getAttribute("src");
    if (dataConfig) {
        return;
        //dataConfig = srcStr.substring(0, srcStr.lastIndexOf("/") + 1) + "config.js";
    }

    var dataMain = loaderScript.getAttribute("data-main");
    //取默认的page.js路径,page.js的路径与core.js的路径相同
    if (dataMain) {
        dataMain = srcStr.substring(0, srcStr.lastIndexOf("/") + 1) + "page.js";
    }

    //Add by hujing

    //首先加载config.js
    dynamicLoadJsTool(
        {
            test: !!dataConfig,
            yep: dataConfig,
            complete: loadMain
        }
    );

    //config.js加载后的数据结构
    var configData = {
        modules: [],
        components: [],
        nameComponents: {},
        nameModules: {},
        pathModules: {}
    };

    /**
     * 解析每个data对象，根据不同的属性存储为configData相应的数据结构，
     * 方便后续loadMain时的查找行为。
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
    function define(data) {
        if (Object.isObject(data)) {
            data.depens = [];//设置data.depens为空数组
            configData.modules.push(data);//将data数据添加到全局变量configData.modules中。
            configData.nameModules[data.name] = data;//添加data.name与data对应关系到configData.nameModules对象中
            configData.pathModules[data.path.toLowerCase()] = data;//添加data.path与data对应关系到configData.pathModules对象中
            //最原始的data中没有依赖任何js所以需要此判断
            if (!data.components) {
                data.components = [];
                //没有依赖任何module的话data.components的name为data.name，module为自身data
                data.components.push({ name: data.name, module: data });
            }
            //遍历data.components 将每个componet存入configData.components,
            // 并对应的添加compnent.name:compnent到nameComponents

            data.components.each(function (compnent) {
                //向每个compnent对象加入module属性，module的值为自身data
                compnent.module = data;
                //添加compnent到全局变量configData.components数组中
                configData.components.push(compnent);
                //添加compnent.name与compnent对应关系到configData.nameComponents对象中
                configData.nameComponents[compnent.name] = compnent;
            });
        }
    }


    /**
     * 完成config.js的加载后执行此方法，
     * 根据依赖关系以LIFO(last-in，first-out)方式加载js模块
     */
    function loadMain() {
        var paths = [];//需要加载的js文件列表
        var callbacks = {};//加载js过程中对应的回调函数

        loadBefore(paths, callbacks);

        dynamicLoadJsTool({
            load: paths,
            callback: callbacks
        });

        loadAfter(paths);
    }

    function loadBefore(paths,callbacks){
        if (!!dataMain) {
            //根据dataMain从configData中获取data数据，注意pathModules中保存的是大写的字符串
            var mainModule = configData.pathModules[dataMain] || configData.nameModules[dataMain];
            //遍历mainModule.components,获取每个component依赖的path
            mainModule.components.each(function (component) {
                //递归方式获取依赖关系
                var mods = getDependentModule(component);
                //从后往前添加js依赖
                for (var i = mods.length - 1; i > -1; i--) {
                    mod = mods[i];
                    var path = mod.path;
                    //剔除重复的
                    if (paths.indexOf(path) == -1) {
                        paths.push(path);
                        //将依赖的depens都追加到depens数组中
                        component.module.depens.push(mod.name);

                        if (!!mod.loaded) {
                            //定义callbacks
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

            //mainModule等自身依赖的js全部加载完成后再进行加载
            paths.push(mainModule.path);
        }
    }

    /**
     * 加载完成后修改pathModules中的data属性isLoad=true
     * @param paths pathModules中的
     */
    function loadAfter(paths) {
        paths.each(function (path) {
            configData.pathModules[path.toLowerCase()].isLoad = true;
        });
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
        dynamicLoadJsTool(needs);
    }


    /**
     * 动态加载js的工具
     */
    function dynamicLoadJsTool(loadObject) {
        yepnope(loadObject);
    }



    function getDependentComponents(component, ret) {
        if (!component) {
            return ret;
        }
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
        if (Object.isString(component)) {
            component = configData.nameComponents[component];
        }
        //如果component没有依赖了则返回
        if (!component.depens) {
            return ret;
        }

        ret = ret || [];

        //遍历component.depens,从name与Components对应关系中获取component,并递归查找
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

    function require() {
    }

    return {
        define: define,
        main: main
    };
})(this, this.document);
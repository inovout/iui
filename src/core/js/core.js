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
                data.components.push({ name: data.name });
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
        define: define
    };
})(this, this.document);
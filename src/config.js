//一个JS文件表示一个module，
//一个module当中至少有一个component，即类。
//依赖关系只局限于component没有module的依赖。
//若没有配置componet，则componet的名称与模块名相同，不过这种情况应该相对较少。
iui.define({
    name: "jQuery",
    path: "../lib/jQuery.js"
});


iui.define({
    name: "element",
    path: "../src/element/js/element.js",
    components: [
        {
            name: "Inovout.Element",
            depens: ["jQuery"]
        }
    ]
});
iui.define({
    name: "view",
    path: "../src/view/js/view.js",
    loaded: "Inovout.View.loadWidget",
    components: [
        {
            name: "Inovout.View",
            depens: ["Inovout.Element"],
        }
    ]
});
iui.define({
    name: "page",
    path: "../src/page/js/page.js",
    components: [
        {
            name: "Page",
            depens: ["Inovout.View"]
        }
    ]
});
iui.define({
    name: "list",
    path: "../src/list/js/list.js",
    components: [
        {
            name: "Inovout.View.List",
            test: function (ele) { return ele.find(".list").length > 0; },
            depens: ["Inovout.View"]
        }
    ]
});
iui.define({
    name: "tip",
    path: "../src/tip/js/tip.js",
    components: [
        {
            name: "Inovout.View.Tip",
            test: function (ele) { return ele.find(".tip").length > 0; },
            depens: ["Inovout.View"]
        }
    ]
});
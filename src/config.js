//一个JS文件表示一个module�?
//一个module当中至少有一个component，即类�?
//依赖关系只局限于component没有module的依赖�?
//若没有配置componet，则componet的名称与模块名相同，不过这种情况应该相对较少�?
//basePath 对象虚拟路径或各站点使用同一个资源站点时有用
define({
    name: "prototype-lang",
    path: "../../jslang/prototype-lang.js",
    components: [
        { name: "Object" },
        { name: "Class" }
    ]
});
define({
    name: "iui-lang",
    path: "../../jslang/iui-lang.js",
    components: [
        { name: "Event", depens: ["Class"] },
        { name: "EventAdapter" },
        { name: "HashMap", depens: ["Class"] }
    ]
});
define({
    name: "element",
    path: "../../element/js/element.js",
    components: [
        {
            name: "Inovout.Element",
            depens: ["Class", "HashMap"]
        }
    ]
});
define({
    name: "view",
    path: "../../view/js/view.js",
    //loaded: "Inovout.View.loadWidget",
    components: [
        {
            name: "Inovout.View",
            depens: ["Inovout.Element"]
        }
    ]
});
define({
    name: "page",
    path: "../../page/js/page.js",
    components: [
        {
            name: "Page",
            depens: ["Inovout.View"]
        }
    ]
});
define({
    name: "list",
    path: "../../list/js/list.js",
    components: [
                {
                    name: "Inovout.View.List",
                    depens: ["Inovout.View", "Page"]
                },
                {
                    name: "Inovout.View.TabList",
                    test: iui.hasClass("tabList"),
                    depens: ["Inovout.View.List"]
                }
    ]
});

define({
    name: "form",
    path: "../../form/js/form.js",
    components: [
                {
                    name: "Inovout.Controls.Form",
                    test: iui.hasAttr("form", "data-async"),
                    depens: ["Inovout.View", "jquery.serializeJSON"]
                }
    ]
});

define({
    name: "FileInput",
    path: "../../form/js/fileinput.js",
    components: [
                {
                    name: "Inovout.Controls.FileInput",
                    test: iui.hasAttr("input", "type", "file"),
                    depens: ["Inovout.View", "moxie"]
                }
    ]
});

define({
    name: "http",
    path: "../../http/js/http.js",
    components: [
        {
            name: "HttpRequest", test: true,
            depens: ["Class"]
        }
    ]
});
define({
    name: "jquery.serializeJSON",
    path: "../../../lib/jquery.serializeJSON.js"
});
define({
    name: "jQuery.XDomainRequest",
    required: ["HttpRequest"],
    test: !$.support.cors,
    path: "../../../lib/moxie.js",
    path: "../../../lib/jQuery.XDomainRequest.js"
});


define({
    name: "moxie",
    path: "../../../lib/moxie.js",
    //success: function () {
    //    o.Env.swf_url = "../../../lib/flash/Moxie.swf";
    //    o.Env.xap_url = "../../../lib/silverlight/Moxie.xap";
    //},
    test: true
});

//��Щģ����ȻTEST���㣬�����ܵ���ʹ�ã���Ҫ������ģ������ʱ������أ���δ��ɡ�
//define({
//    name: "base64",
//    path: "../../../lib/base64.js",
//    required: ["HttpRequest"],
//    test: window.btoa && window.atob
//});
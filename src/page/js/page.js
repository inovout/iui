var Page =  Class.create({

    initialize: function () {
    }};
});

Page.fn = Page.prototype = {
    init: function () {

        ///	<summary>
        ///		初始化 Page 类的新实例。
        ///	</summary>

        //处理Domain问题，如果为IP则不处理
        var domianRegex = /(?:[\w_-]+)(?:\.(?:cn|com|gov|edu|mil|net|org|uk|us|tw|se|ru|mo|kr|jp|it|hk|gb|ca|au))+/;
        if (location.hostname) {
            var documnetDomain = location.hostname.match(domianRegex);
            if (documnetDomain) {
                window.document.domain = documnetDomain;
            }
        }

        $(document).ready(function () {

            //临时解决ajaxpro超时问题
            if (typeof AjaxPro != "undefined") {
                AjaxPro.timeoutPeriod = 20 * 60 * 1000;
            }
            //如果是ＩＥ６设置input的ｔｅｘｔ的宽度
            if ($.browser.msie && $.browser.version == "6.0") {
                $("form input:text").not(".isFreeWidth").css("width", "99%");
            }
            $("body").hidden();
            //HidCtl('tableRow_XYDTJZSH,tableRow_TDZSBH,');
            //处理控件权限，另外还需处理自定义或特殊控件，如：日历
            if (page.permissionControlIDs && page.permissionControlIDs.length) {
                var pagePermission = new PagePermission();
                pagePermission.beforePermission = function (dom, state) {
                    var domJQ = $(dom);
                    var id = dom.id;
                    if (id && id.substr(0, 9) == "divHeader") {
                        var parent = domJQ.parent();
                        var rowParent = parent.parent().parent().find("[name='view']");
                        var index = parent.children().index(domJQ[0]);
                        if (index > -1) {
                            rowParent.children().eq(index).html("&nbsp");
                        }
                        return false;
                    }
                };
                pagePermission.checkPermission(page.permissionControlIDs);
            }

            if (document.URL.toUpperCase().indexOf("KCDJBG/VIEW.ASPX", 0) > 0) {
                //setTimeout(delayFunction, 3000);
                //为了勘测定界报告页面的界址点表的地块圈列表不错乱注释了setTimeout(delayFunction, 3000);
                delayFunction();
            } else {
                delayFunction();
            }
            function delayFunction() {
                if (page.pageModel == "readOnly") {
                    var pagePermission2 = new PagePermission();
                    $.each($(":input:visible"), function (i, n) {
                        pagePermission2.controlReadOnly($(n));
                    });
                    $.each($("div.blockFly.target"), function (i, n) {
                        pagePermission2.controlHide($(n));
                    });
                    $("[id$='Tip']").remove();
                }
                //处理表格高度
                $(".tableRow").each(function () {
                    $(this).adjustTableHeight();
                });
                $("body").css("visibility", "inherit");
                $("body").visit();
                //处理表单提交和验证
                $("form").each(function () {
                    if (!$.formValidator) {
                        return;
                    }
                    //验证
                    //var dataValid = DataDetailsView(this.id);
                    DataDetailsView({ formid: this.id });

                    //dataValid.extraFnValid(test);
                    //提交事件处理
                    var form = this;
                    var submitButton = $(this).find("input[type='submit']");
                    submitButton.bind("click", function (event, actionName) {
                        var formJQ = $(form);
                        var formId = formJQ.attr("id");
                        page.submit(formId, actionName);
                        $(this).unbind("submit");
                        return false;
                    });
                });
            }
            //            $(":text,textarea").showTip();
            var globalShowTip = false;
            //集中控制所有输入是否需要浮动提示框
            if (typeof globalShowTip != "undefined")
                $(":text,textarea").showTip({ isWork: globalShowTip });
            else
                $(":text,textarea").showTip({ isWork: true });


            //处理ajax请求
            $(document).ajaxSend(function (evt, request, settings) {

                page.ajaxSettings.add(settings);
            }).ajaxComplete(function (evt, request, settings) {
                page.ajaxSettings.remove(settings);
            });
            var tabPage = new TabPage("tab");
            tabPage.clickedClassName = "clickedClassName";
            tabPage.dataSource = ".formPage";
            tabPage.dataBind();
            //处理所有按钮的移出移近效果
            changeBgImage();
            // 绑定窗口重置大小事件.未来还需通过某种机制减少事件触发的频率.
            if (page.onResize) $(window).resize(page.onResize);
            $(window).resize(page.subWindowArea);

            //如果是模态窗体，则执行一写

            if (window.dialogArguments) {
                if (typeof (window.dialogArguments.data) != "undefined") { //临时解决由于平台引起的冲突
                    window.isFromFloatWindow = true;
                    var toolBar = new ModalDialogToolbar("ModalDialogToolbar");
                    toolBar.dataSource = window.dialogArguments.btns;
                    toolBar.dataBind();

                    FloatWindow.fn.toolBar = toolBar;
                    if (typeof (setValue) == "function") {
                        setValue(window.dialogArguments.data);
                    }

                    $("a:first").trigger("focus");
                }
            }
            page.subWindowArea();
            //初始化控件
            if (page.onInitControl) page.onInitControl();
            //初始化控制器
            if (page.onInitController) page.onInitController();
            //开始运行前事件
            if (page.onBeforeRun) page.onBeforeRun();
            if (page.initControl.items) {
                page.initControl.excute();
            }
            $("#form1").visit();
        });

        return this;
    },
    ajaxSettings: new ArrayList(),  ///	<summary>页面管理的控件数组</summary>
    permissionControlIds: "",       ///	<summary>需处理权限的控件Id组字符串</summary>
    permissionRegionControlIds: "",       ///	<summary>需处理权限的控件Id组字符串</summary>
    pageMode: undefined,           ///	<summary>页面模式，View表示只读</summary>
    controls: new ArrayList(),       ///	<summary>页面管理的控件数组</summary>
    onInitControl: undefined,        ///	<summary>初始化控件事件</summary>
    onInitController: undefined,     ///	<summary>初始化控件事件</summary>
    onBeforeRun: undefined,           ///	<summary>初始化数据事件</summary>
    onUnload: undefined,            ///	<summary>页面卸载事件</summary>
    onResize: undefined,             ///	<summary>页面大小调整事件</summary>
    initControl: function (fn) {
        if (!this.initControl.items) {
            this.initControl.items = new ArrayList();
            this.initControl.excute = function () {
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i]();
                }
            }
        }

        this.initControl.items.add(fn);
    },
    beforeSubmit: function (fn) {
        ///	<summary>
        ///		加载提交前事件。
        ///	</summary>
        if (!this.beforeSubmit.items) {
            this.beforeSubmit.items = new ArrayList();
            this.beforeSubmit.excute = function () {
                if (!this.items) {
                    return;
                }
                for (var i = 0; i < this.items.length; i++) {
                    if (!this.items[i]()) {
                        return false;
                    };
                }
                return true;
            }
        }
        this.beforeSubmit.items.add(fn);
    },
    addControl: function (control) {
        ///	<summary>
        ///		添加控件
        ///	</summary>
        ///	<param name="control" type="Control">
        ///     自定义控件类的实例
        ///</param>
        this.controls.add(control);
    },
    getControl: function (controlId) {
        ///	<summary>
        ///		获取控件
        ///	</summary>
        ///	<param name="controlId" type="String">
        ///     控件Id
        ///</param>
        return this.controls.find(function (control) {
            if (control && control.controlId === controlId) return true;
        });
    },
    submit: function (formId, actionName, isSkipValidation) {
        ///	<summary>
        ///		提交表单
        ///	</summary>
        //默认不能跳过验证
        if (!isSkipValidation) {
            isSkipValidation = false;
        }
        var form = $("#" + formId)[0];
        //验证通过后，才能提交
        if (!isSkipValidation) {
            if (page.getControl("DataDetailsView") && !page.getControl("DataDetailsView").groupIsValid("1")) {
                return false;
            }
        }
        var submitBtn = $("#" + formId).find(":submit")[0];
        var actionUrl = "";
        if (actionName) {
            actionUrl = "Action=" + actionName;
        } else {
            actionUrl = "Action=" + submitBtn.id;
        }
        var url = document.location.toString();
        if (url.lastIndexOf("#") > 0) {
            url = url.substring(0, url.lastIndexOf("#"));
        }
        if (url.indexOf("?") > -1) {
            form.action = url + "&" + actionUrl;
        } else {
            form.action = url + "?" + actionUrl;
        }
        if (page.ajaxSettings.length) {
            $.blockUI({
                message: "正在加载中..."
            });
            var intervalId = setInterval(function () {
                if (!page.ajaxSettings.length) {
                    clearInterval(intervalId);
                    $("#" + formId)[0].submit();
                }
            }, 50);
        }
        else {
            $("#" + formId)[0].submit();
        }
    },
    lock: function () {
        if (page.isLock) return;
        page.isLock = true;
        var showmsg = "正在处理数据中，请稍后...";
        var width = 400;
        var height = 100;
        $.blockUI({
            message: '<div class="progressbarbox">' + showmsg + '</div>',
            css: {
                left: ($(window).width() - width) / 2 + "px",
                top: ($(window).height() - height) / 2 + "px",
                width: width + "px",
                height: height + "px",
                cursor: "default",
                border: "0px",
                background: "Transparent"
            }
        });
    },
    unLock: function () {
        if (page.isLock) {
            page.isLock = false;
            $.unblockUI();
        }
    },
    subWindowArea: function () {
        page.subWindowArea.height = $(window).height() - 50;
        $(".formPage").height($.windowHeight() - $("#tab").height() - ($("#ModalDialogToolbar").height() ? $("#ModalDialogToolbar").height() + 10 : 16));

    },
    version: "1.0.0"///	<summary>版本号</summary>
});

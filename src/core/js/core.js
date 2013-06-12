Inovout = {};
var inits = {};

//main $(function)=$(document).ready(function)
//想方法订阅document.load事件，目前是与jQery绑定
jQuery(function () {
    for (initKey in inits) {
        inits[initKey](initKey);
    }
});

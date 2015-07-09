/**
 * Created by andrew on 2015-05-28.
 */
"use strict";
require(['runtime/su'], function (su) {
    function run() {
        var src = document.getElementById("su_source").value;
        var req = new XMLHttpRequest();
        req.onload = results;
        req.open("post", "/run", true);
        req.send(src);
    }
    function results() {
        var result = JSON.parse(this.responseText);
        document.getElementById("su_result").value = result.su_result;
        document.getElementById("js_source").value = result.js_source;
        var js_result;
        try {
            js_result = eval(result.js_source + '();');
        }
        catch (e) {
            js_result = e;
        }
        document.getElementById("js_result").value = js_result;
    }
    document.getElementById('run').onclick = run;
});

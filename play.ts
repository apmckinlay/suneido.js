/**
 * Created by andrew on 2015-05-28.
 */
/// <reference path="require.d.ts" />
"use strict";

require(['su'],
    function (su) {
        function run(): void {
            var src = (<HTMLInputElement>document.getElementById("su_source")).value;
            var req = new XMLHttpRequest();
            req.onload = results;
            req.open("post", "/run", true);
            req.send(src);
        }

        function results(): void {
            var result = JSON.parse(this.responseText);
            (<HTMLInputElement>document.getElementById("su_result")).value = result.su_result;
            (<HTMLInputElement>document.getElementById("js_source")).value = result.js_source;
            var js_result;
            try {
                js_result = eval(result.js_source + '\nf();');
            } catch (e) {
                js_result = e;
            }
            (<HTMLInputElement>document.getElementById("js_result")).value = js_result;
        }

        document.getElementById('run').onclick = run;
    });

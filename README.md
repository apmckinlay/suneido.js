# suneido.js

A web browser front end for [Suneido](http://suneido.com) for an alternative
(or replacement) for the current Win32 GUI.

**Note:** This is not a port of Suneido to Javascript. The intent is to use
jSuneido (the Java implementation) as the web and database server. 
Suneido code to be run on the browser will be translated to JavaScript
on the server.

Includes a runtime support library for Suneido code translated/compiled to JavaScript 
to run in the browser. The actual translation is done by Suneido code running 
on jSuneido. (not included in this repo)

play.html and libview.html must be run from jSuneido JsPlayServer.

To run the tests, compile the TypeScript with `--module commonjs`
To run the web pages, compile with `--module amd`

See also: 

* [Github Wiki](https://github.com/apmckinlay/suneido.js/wiki) 

* [Github Issues](https://github.com/apmckinlay/suneido.js/issues)
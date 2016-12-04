# suneido.js

A web browser front end for [Suneido](http://suneido.com) for an alternative
(or replacement) for the current Win32 GUI.

**Note:** This is not a complete port of Suneido to Javascript. The intent is 
to use jSuneido (the Java implementation) as the web and database server. 
Suneido code to be run on the browser will be translated to JavaScript
on the server.

Includes a runtime support library for Suneido code translated/compiled to JavaScript 
to run in the browser. The actual translation is done by Suneido code running 
on jSuneido. (not included in this repo)

To run the tests:

  make test

To expand //BUILTIN

  make builtins

To bundle for the browser:

  make bundle

play.html and libview.html must be run from jSuneido JsPlayServer
(jSuneido requires its database in the current working directory)

  $ java -jar jsuneido.jar
  > JsPlayServer(dir: '...', port: 8080)

Where dir is the directory containing suneido.js

Then you should be able to use Chrome to go to:

  localhost:8080/play.html

or:

  localhost:8080/libview

An alternative is to run JsParseServer on jSuneido and then run JsPlayServer on cSuneido (with Suneido.JsParseServer = true) so the IDE can be used for debugging.

See also: 

* [Github Wiki](https://github.com/apmckinlay/suneido.js/wiki) 

* [Github Issues](https://github.com/apmckinlay/suneido.js/issues)
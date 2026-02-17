# suneido.js

A web browser front end for [Suneido](http://suneido.com) for an alternative
(or replacement) for the current Win32 GUI.

**Note:** This is not a complete port of Suneido to Javascript. The intent is 
to use gSuneido (the Go implementation) as the web and database server. 
Suneido code to be run on the browser will be translated to JavaScript
on the server.

Includes a runtime support library for Suneido code translated/compiled to JavaScript 
to run in the browser. The actual translation is done by Suneido code running 
on gSuneido. (not included in this repo)

To run the tests:

  make test

To expand //BUILTIN

  make builtins

To bundle for the browser:

  make bundle

See also: 

* [Github Wiki](https://github.com/apmckinlay/suneido.js/wiki) 

* [Github Issues](https://github.com/apmckinlay/suneido.js/issues)
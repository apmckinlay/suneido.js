---
---
Implementation
==============

String
-------
Use plain JavaScript strings with no wrapper.

Number
------
Use both plain JavaScript numbers and our own Dnum's.

A Dnum is internally represented as a pair of JavaScript safe integer numbers, a coefficient and an exponent. This gives 53 bit range which is almost 16 decimal digits. See dnum.ts

Note: This means 64 bit integers are not supported.

Date
----
An SuDate is internally represented as a pair of JavaScript safe integer numbers, a date and a time. This is close to the stored database format, making IO fast. See sudate.ts

Object
------
Uses a JavaScript Array and Map. See suobject.ts

Regex
-----
Use our own implementation so we get identical behavior.

Local Variables
---------------
Use plain JavaScript variables.

Functions/Methods
-----------------
Functions are JavaScript functions with properties for the three call adapters (see Calling Conventions)

Calling Conventions
-------------------
Three entry points to functions to minimize preambles - un-named arguments only, with named arguments, and @args. Named arguments are passed as a JavaScript object as the first argument. @args are passed as an SuObject.

Mandatory arguments have a default value of mandatory() e.g. function (x = mandatory()).

To detect too many arguments (which JavaScript ignores) use maxargs e.g. maxargs(3, arguments.length)

For built-in functions and methods the adapters are generated based on special comments in the code.

Classes
-------
Use JavaScript "this" (???)

Closures
--------
Use JavaScript closures (???)

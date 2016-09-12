---
---
Implementation
==============

SuValue is the base class for SuNum, SuDate, SuObject, and RootClass

String
-------
Use plain JavaScript strings with no wrapper.

Number
------
Use plain JavaScript numbers when they are safe integers and our own SuNum (decimal floating point) otherwise.

An SuNum is internally represented as a pair of JavaScript safe integer numbers, a coefficient and an exponent. This gives 53 bit range which is almost 16 decimal digits. See dnum.ts

Note: This means 64 bit integers are __not__ supported.

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
Three entry points to functions to minimize preambles - un-named arguments only ($call, $invoke), with named arguments ($callNamed, $invokeNamed), and @args ($callAt, $invokeAt). Named arguments are passed as a JavaScript object as the first argument. @args are passed as an SuObject.

Mandatory arguments have a default value of mandatory() e.g. function (x = mandatory()).

To detect too many arguments (which JavaScript ignores) use maxargs e.g. maxargs(3, arguments.length)

For built-in functions and methods the adapters are generated based on special comments in the code.

Blocks
------
Use JavaScript ES6/2015 arrow functions since they preserve "this".

Use exceptions for return, break, continue as in cSuneido and jSuneido.

Classes
-------
Classes are translated to plain JavaScript objects. (see JsTranslateClass)

Inheritance is via JavaScript prototype.

Use normal JavaScript "this".

Members (including methods) are regular properties.

Classes are frozen to ensure they are not modified.

Use a RootClass as the ultimate prototype. (see rootclass.ts)

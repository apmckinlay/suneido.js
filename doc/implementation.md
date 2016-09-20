suneido.js Implementation
=========================

String
-------
Use JavaScript strings.

Number
------
A Dnum is internally represented as a pair of JavaScript numbers, a coefficient and an exponent. See dnum.ts

Date
----
An SuDate is internally represented as a pair of JavaScript numbers, a date and a time. This is close to the stored database format, making IO fast. See sudate.ts

Object
------
Uses a JavaScript Array and Map. See suobject.ts

Regex
-----
Use our own implementation so we get identical behavior.

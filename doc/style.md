* use `let` instead of `var`

* declare and initialize variables immediately before they are used, rather than at the start of a function

* make things private or unexported where possible

* nest functions that are only used locally

* use ES6 classes where applicable

* declare function parameter types and return types, but not variables (unless there is a particular reason)

* use ES6 style `import`

* write range comparisons like `lo <= x && x <= hi` or `x < lo || hi < x`

* use `const` for immutable values (not for every variable that isn't modified)

* use `ob.field` rather than `ob["field"]`

* use all capitals for the names of constants

* capitalize the names of types e.g. classes

* normally declare functions (and classes) rather than assigning them to variables e.g. `function fn...` rather than `fn = function`

* prefer standalone functions to closures, i.e. pass values as arguments rather than directly accessing context

* use `++` and `--` rather than `+= 1` or `-= 1`

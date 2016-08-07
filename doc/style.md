* use `let` or `const` instead of `var`

* use one `let` or `const` per variable

* use `const` for immutable __values__ (not for every variable that isn't modified)

* declare and initialize variables immediately before they are used, rather than at the start of a function

* make things private or unexported where possible

* nest functions that are only used locally, as long as they're not too big

* use ES6 classes where applicable

* declare function parameter types and return types, but not variables (unless there is a particular reason)

* use ES6 style `import`

* write range comparisons like `lo <= x && x <= hi` or `x < lo || hi < x`

* use `ob.field` rather than `ob["field"]`

* use `{ age: 123 }` rather than `{ "age": 123 }`

* use all capitals for the names of constants

* capitalize the names of types e.g. classes

* normally declare functions (and classes) rather than assigning them to variables e.g. `function fn...` rather than `fn = function`

* prefer standalone functions to closures, i.e. pass values as arguments rather than directly accessing context

* use `++` and `--` rather than `+= 1` or `-= 1`

* avoid `null`, use `undefined` instead

* use == or != undefined to check for null or undefined

* use slice instead of substring

* use [] instead of .charAt()

* throw Error's (not strings or other values)

* avoid default exports

* use `as` for type assertions, not `<type>`

* minimize the use of type assertions

https://basarat.gitbooks.io/typescript/content/docs/types/type-assertion.html

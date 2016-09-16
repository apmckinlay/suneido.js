.PHONY: builtins

bundle: runtime/*.js runtime/builtin/*.js
	tsc
	node devtools/setbuilt.js runtime/builtin/built.js
	browserify runtime/su.js -o runtime/su_bundle.js -s su

builtins: runtime/builtin/*.ts runtime/rootclass.ts runtime/globals.ts
	node devtools/builtins.js $^

test: runtime/*_test.js runtime/builtin/*_test.js
	node runtime/tests.js $^

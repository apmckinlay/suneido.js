.PHONY: builtins

bundle: runtime/*.ts runtime/builtin/*.ts runtime/builtin/UI/*.ts
	tsc
	node devtools/setbuilt.js runtime/builtin/built.js
	browserify runtime/su.js -o runtime/su_bundle.js -s su

builtins: runtime/builtin/*.ts runtime/rootclass.ts runtime/globals.ts runtime/builtin/UI/*.ts
	node devtools/builtins.js $^

test: runtime/*_test.js runtime/builtin/*_test.js runtime/builtin/UI/*_test.js
	node runtime/tests.js $^

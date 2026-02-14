.PHONY: builtins codemirror

bundle: runtime/*.ts runtime/builtin/*.ts runtime/builtin/UI/*.ts
	tsc
	node devtools/setbuilt.js runtime/builtin/built.js
	npx browserify runtime/su.js -o runtime/su_bundle.js -s su
	npx uglifyjs runtime/su_bundle.js --source-map "root='/',url='su_bundle.min.js.map'" -o runtime/su_bundle.min.js -c -m
	node devtools/listGlobals.js runtime/su_global_builtins.json

builtins: runtime/builtin/*.ts runtime/rootclass.ts runtime/globals.ts runtime/builtin/UI/*.ts
	node devtools/builtins.js $^

test: runtime/*_test.js runtime/builtin/*_test.js runtime/builtin/UI/*_test.js
	tsc
	node runtime/tests.js $^

CODEMIRRORFILES = node_modules/codemirror/lib/codemirror.js node_modules/codemirror/addon/display/rulers.js CodeMirror/Suneido.js
codemirror: 
	npx uglifyjs $(CODEMIRRORFILES) -o CodeMirror/codemirror_bundle.js -c -m
.PHONY: builtins codemirror

bundle: runtime/*.ts runtime/builtin/*.ts runtime/builtin/UI/*.ts
	tsc
	node devtools/setbuilt.js runtime/builtin/built.js
	npx browserify runtime/su.js -o runtime/su_bundle.js -s su
	npx uglifyjs runtime/su_bundle.js --source-map "root='/',url='su_bundle.min.js.map'" -o runtime/su_bundle.min.js -c -m

builtins: runtime/builtin/*.ts runtime/rootclass.ts runtime/globals.ts runtime/builtin/UI/*.ts
	node devtools/builtins.js $^

test: runtime/*_test.js runtime/builtin/*_test.js runtime/builtin/UI/*_test.js
	tsc
	node runtime/tests.js $^

CODEMIRRORFILES = node_modules/codemirror/lib/codemirror.js node_modules/codemirror/addon/fold/foldcode.js node_modules/codemirror/addon/fold/foldgutter.js node_modules/codemirror/addon/fold/brace-fold.js node_modules/codemirror/addon/edit/matchbrackets.js node_modules/codemirror/addon/edit/closebrackets.js node_modules/codemirror/addon/comment/comment.js node_modules/codemirror/addon/selection/active-line.js  node_modules/codemirror/addon/selection/mark-selection.js node_modules/codemirror/addon/display/panel.js node_modules/codemirror/addon/runmode/runmode.js CodeMirror/Suneido.js CodeMirror/HighlightWords.js
codemirror: 
	npx uglifyjs $(CODEMIRRORFILES) -o CodeMirror/codemirror_bundle.js -c -m
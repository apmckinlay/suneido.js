.PHONY: bundle builtins test codemirror

bundle: runtime/*.ts runtime/builtin/*.ts runtime/builtin/UI/*.ts
	npx tsc
	node devtools/setbuilt.js runtime/builtin/built.js
	npx esbuild runtime/su.js --bundle --platform=browser --format=iife --global-name=su --log-override:direct-eval=silent --outfile=runtime/su_bundle.js
	npx esbuild runtime/su.js --bundle --platform=browser --format=iife --global-name=su --minify --sourcemap --source-root=/ --log-override:direct-eval=silent --outfile=runtime/su_bundle.min.js
	node devtools/listGlobals.js runtime/su_global_builtins.json

builtins: runtime/builtin/*.ts runtime/rootclass.ts runtime/globals.ts runtime/builtin/UI/*.ts
	node devtools/builtins.js $^

test: runtime/*_test.js runtime/builtin/*_test.js runtime/builtin/UI/*_test.js
	npx tsc
	node runtime/tests.js $^

codemirror: 
	npx esbuild CodeMirror/codemirror_entry.js --bundle --platform=browser --format=iife --minify --outfile=CodeMirror/codemirror_bundle.js

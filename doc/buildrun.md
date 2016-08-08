Requirements
------------
Node.js ("current", not "stable")

TypeScript (npm install -g typescript)

Tslint (npm install -g tslint)

Recommended
-----------
Chrome

Visual Studio Code - for debugging TypeScript

Alm = editor, automatic lint and compile

Atom - editor

Building
--------
From the suneido.js directory run: tsc

To watch and recompile when files change run: tsc -w<br/ >
(not necessary with Alm)

tsconfig is set to output UMD modules which should work in both Node and the browser.

Running Tests
-------------
From the suneido.js directory run: node runtime/tests.js

To debug, Visual Studio Code (the editor) works well.

In Browser
------------------
tsconfig is targetting ES6/2015. Testing is being done with Chrome. (TypeScript can target ES5 but this isn't being tested.)

In jSuneido, run: JsParseServer()

In cSuneido, run: JsPlayServer(dir: `<suneido.js dir>`)

In the browser go to one of:
* localhost://libview
* localhost://play.html

If you make changes to the stdlib code you will need to refresh the browser page.

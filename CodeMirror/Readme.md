# CodeMirror for Suneido

## Customized features:

1. Suneido.js Suneido.css

   Suneido.js defines a Suneido style mode for CodeMirror editor. To use it, add option
   ```javascript
     mode: "suneido"
   ```
   when creating the Codemirror editor.
  
2. Search.js Dialog.js Dialog.css

   provide the Suneido style search and replace dialogs, which support both normal and regular expression. The newly added CodeMirror Commands are
     - find
     - findNext
     - findPrev
     - clearSearch
     - replace
     - replaceAll
     - replaceCurrent
   To use these commands and trigger the search and replace bar, bind the commands with keys with the option key word *extraKeys*, e.g.
   ```javascript
  extraKeys: {"Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
		"Ctrl-F": "find",
		"F3": "findNext",
		"Shift-F3": "findPrev",
		"Ctrl-H": "replace",
		"Shift-Ctrl-H": "replaceAll",
		"F8": "replaceCurrent",
		"Ctrl-/": "toggleComment",
		"Shift-Ctrl-/": function (cm) {
  	var from = cm.getCursor("from"),
  		to = cm.getCursor("to");
  	if (cm.uncomment(from, to) === false) {
  		cm.blockComment(from, to, {fullLines: false});
  	}
  }}
	```
3. HighlightWords.js

   When enabled, automatically highlight words that are same as the word under current cursor. To enable this, add the option
   ```javascript
    highlightWords : true
   ```
   when creating the Codemirror editor.
   
4. Suneido-hint.js

   provides the auto-completion feature. To enable this, add the option 
   ```javascript
   autoCompletion: true
   ```
   when creating the Codemirror editor.
   
   **Notice** This feature relys on the server to provide candidate list through ajax. So, make the server provide reponses to the following queries before enable this feature:
     * GET .../LibLocateList?q=key
       
       requests the global variables, functions or classes starting with the *key*. The corresponding method in Suneido is 
       ``` LibLocateList.GetMatches(key, justName:) ```
       
     * GET .../ClassHelpPublicMembersOfName?q=key
     
       requests the public members of the given class *key*. The corresponding method in Suneido is 
       ``` ClassHelp.PublicMembers(key) ```
       
     * GET .../DefaultMethods?q=unused
     
       requests the default methods. The corresponding method in Suneido is 
       ``` Objects.Members().Add(@BasicMethods).Sort!().Unique!() ```
       
     * GET .../InheritedPublicMembers?q=key
     
       requests the public members of the base class *key*. The corresponding method in Suneido is 
       ``` ClassHelp.PublicMembers(key) ``` (**should be removed, use *ClassHelpPublicMembersOfName* instead.**)
       
   The response content should be in JSON format with an attribute *matches*, which contains a list of condidate strings.
   
   A snippet of Suneido code to handle the above requests is shown as follow (an updated version of **JsPlayServer**)
   ```javascript
   class
	{
	CallClass(dir = '.', svcpass = false, port = 80)
		{
		Print(:dir, :svcpass, :port)
		RackServer(app: new this(dir, svcpass), port: port)
		}
	New(.dir, .svcpass)
		{ }
	Call(env)
		{
		Print(env.request)
		if env.path.Has?('.html/')
			env.path = env.path.BeforeLast('/')
		Print(env.path)
		// .html, .css, and .js static files from dir
		if env.path.AfterLast('.') in ('html', 'js', 'css')
			{
			if env.method isnt 'GET'
				return .methodNotAllowed(env)
			if false isnt data = GetFile(Paths.Combine(.dir, env.path))
				return Object('200 OK', .header(env.path), data)
			}
		// run and transpile some statements
		else if env.path is '/run'
			{
			if env.method isnt 'POST'
				return .methodNotAllowed(env)
			return JsPlayRun(env)
			}
		// get a library record
		else if env.path.Prefix?('/libget/')
			{
			if env.method isnt 'GET'
				return .methodNotAllowed(env)
			split = env.path[1..].Split('/')
			if false isnt x = Query1(split[1], group: -1, name: split[2])
				return x.text
			}
		// update libraries from version control
		else if env.path is '/update'
			{
			if env.method isnt 'POST'
				return .methodNotAllowed(env)
			return JsUpdate('axon234.innovationplace.com', .svcpass)
			}
		else if env.path.Prefix?('/LibLocateList')
			{
			if env.method isnt 'GET'
				return .methodNotAllowed(env)
			matches = LibLocateList.GetMatches(env.queryvalues.q, justName:)
			return Json.Encode(Object(matches: matches))
			}
		else if env.path.Prefix?('/ClassHelpPublicMembersOfName')
			{
			if env.method isnt 'GET'
				return .methodNotAllowed(env)
			matches = ClassHelp.PublicMembers(env.queryvalues.q)
			return Json.Encode(Object(matches: matches))
			}
		else if env.path.Prefix?('/DefaultMethods')
			{
			if env.method isnt 'GET'
				return .methodNotAllowed(env)
			matches = Objects.Members().Add(@BasicMethods).Sort!().Unique!()
			return Json.Encode(Object(matches: matches))
			}
		else if env.path.Prefix?('/InheritedPublicMembers')
			{
			if env.method isnt 'GET'
				return .methodNotAllowed(env)
			matches = ClassHelp.PublicMembersOfName(env.queryvalues.q)
			return Json.Encode(Object(matches: matches))
			}
		return ['404 Not Found', #(), 'not found']
		}
	header(path)
		{
		switch path.AfterLast('.')
			{
		case 'html':
			type = 'text/html'
		case 'css':
			type = 'text/css'
		case 'js':
			type = 'application/javascript'
			}
		return Object('Content-Type': type)
		}
	methodNotAllowed(env)
		{
		// 405 should include an Allows header with the supported methods
		return ['405 Method Not Allowed', #(),
			'method not allowed: ' $ env.request]
		}
	}
	 ```
	 

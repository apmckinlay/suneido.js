(function(mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		mod(require("../../lib/codemirror"));
	else if (typeof define == "function" && define.amd) // AMD
		define(["../../lib/codemirror"], mod);
	else // Plain browser env
		mod(CodeMirror);
})(function(CodeMirror) {
	CodeMirror.defineOption("autoCompletion", false, function (cm, val, old) {		
		var	autocomplete = function(){
			var ExcludedIntelliSenseTriggerKeys = {
				"8": "backspace",
				"9": "tab",
				"13": "enter",
				"16": "shift",
				"17": "ctrl",
				"18": "alt",
				"19": "pause",
				"20": "capslock",
				"27": "escape",
				"33": "pageup",
				"34": "pagedown",
				"35": "end",
				"36": "home",
				"37": "left",
				"38": "up",
				"39": "right",
				"40": "down",
				"45": "insert",
				"46": "delete",
				"91": "left window key",
				"92": "right window key",
				"93": "select",
				"107": "add",
				"109": "subtract",
				//"110": "decimal point",
				"111": "divide",
				"112": "f1",
				"113": "f2",
				"114": "f3",
				"115": "f4",
				"116": "f5",
				"117": "f6",
				"118": "f7",
				"119": "f8",
				"120": "f9",
				"121": "f10",
				"122": "f11",
				"123": "f12",
				"144": "numlock",
				"145": "scrolllock",
				"186": "semicolon",
				"187": "equalsign",
				"188": "comma",
				"189": "dash",
				//"190": "period",
				//"191": "slash",
				"192": "graveaccent",
				"220": "backslash",
				"222": "quote" },
				timer;
			return function(cm, event) {
				var doc = cm.getDoc(),
					cur = doc.getCursor(),
					word = getCurrentReference(cm);
				if (ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()])
					return;
				if (cm.state.completionActive)
					cm.state.completionActive.close();
				if ( !word )
					return;
				if (timer)
					clearTimeout(timer);
				timer = setTimeout(function(){
					CodeMirror.commands.autocomplete(cm, suneidoAutoComplete, 
					{completeSingle: false, async: true});
				}, 500);
			};
		}();
		
		if (old && old !== CodeMirror.Init) {
			cm.off("keyup", autocomplete);
		}
        if (val) {
            cm.on("keyup", autocomplete);
        }
    });

	function getScanner(text){
		var tokens = [],
			index = 0;
		CodeMirror.runMode(text, 'suneido', function(text, style){
			if (typeof style !== 'undefined' && !(/^\s*$/.test(text)))
				tokens.push({token: text, style: style});
		});
		return {
			next:	function(){ return tokens[++index] || null; },
			ahead:  function(){ return tokens[index + 1] || {}; },
			prev:	function(){ return tokens[index - 1] || {}; },
			prev2:	function(){ return tokens[index - 2] || {}; },
			reset:	function(){ index = -1; }
		};
	}
	
	function getClassHelper(text){
		var scanner = getScanner(text),
			globalPattern = /^_?[A-Z]/;
		return {
			isGlobalName: function(name){
				return /^[A-Z]\w*[!?]?$/.test(name);
			},
			isLocalName: function(name){
				return /^[a-z]\w*[!?]?$/.test(name);
			},
			getSuperClass: function(){
				scanner.reset();
				do {
					tokenOb = scanner.next();
				} while(tokenOb.style === 'comment');
				
				if (!tokenOb)
					return false;
				if (tokenOb.token === 'class' && scanner.ahead().token === ':'){
					tokenOb = scanner.next();
					if (globalPattern.test(scanner.ahead().token))
						return scanner.ahead().token;
				}else if (globalPattern.test(tokenOb.token))
					return tokenOb.token;
				return false;
			},
			getPublicMembers: function(){
				var tokenOb,
					nest = 0,
					list = [],
					base;
				scanner.reset();
				tokenOb = scanner.next();
				while (tokenOb){
					if (tokenOb.token === '{' || tokenOb.token === '[' ||
						tokenOb.token === '(')
						nest++;
					else if (tokenOb.token === '}' || tokenOb.token === ']' ||
						tokenOb.token === ')')
						nest--;
					if (nest === 1 && tokenOb.style === 'variable' && 
						/[A-Z]/.test(tokenOb.token[0])){
						if (list.includes(tokenOb.token))
							list.push(tokenOb.token);
					}
					tokenOb = scanner.next();
				}
				base = this.getSuperClass(scanner);
				if (base)
					alert("Request public members of class " + base);
				return list.sort();
			},
			getPrivateMembers: function(){
				var tokenOb,
					nest = 0,
					list = [];
				scanner.reset();
				tokenOb = scanner.next();
				while (tokenOb){
					if (tokenOb.token === '{' || tokenOb.token === '[' ||
						tokenOb.token === '(')
						nest++;
					else if (tokenOb.token === '}' || tokenOb.token === ']' ||
						tokenOb.token === ')')
						nest--;
					if (tokenOb.style !== 'variable' || !this.isLocalName(tokenOb.token || ""))
						continue;
					if (nest === 1) {
						if (list.includes(tokenOb.token))
							list.push(tokenOb.token);
					} else if (nest > 1 && scanner.prev().token === '.' &&
						!this.isLocalName(scanner.prev2().token) && scanner.ahead().token === '=') {
						if (list.includes(tokenOb.token))
							list.push(tokenOb.token);
					}
					tokenOb = scanner.next();
				}
				return list.sort();
			},
			getTextNames: function(){
				var words = [],
					tokenOb;
				scanner.reset();
				tokenOb = scanner.next();
				while (tokenOb){
					if (tokenOb.style === 'variable'){
						if (words.includes(tokenOb.token))
							words.push(tokenOb.token);
					}
					tokenOb = scanner.next();
				}
				return words.sort();
			},
			getLibRecordType: function() {
				var tokenOb, tokenObAhead;
				scanner.reset();
				do {
					tokenOb = scanner.next();
				} while(tokenOb.style === 'comment');
				
				if (!tokenOb)
					return false;
				tokenObAhead = scanner.ahead();
				if (tokenOb.token === 'class' || tokenOb.token == 'function' || 
					tokenOb.token === 'struct' || tokenOb.token === 'dll' || 
					tokenOb.token === 'callback')
					return tokenOb.token;
				if (tokenOb.token === '#' && tokenObAhead && tokenObAhead.token === '(')
					return 'object';
				if (tokenOb.token === '[' || (tokenOb.token === '#' && 
					tokenObAhead && tokenObAhead.token === '{'))
					return 'record';
				if (tokenOb.style === 'number' || (tokenOb.token === '-' && 
					tokenObAhead && tokenObAhead.style === 'number'))
					return 'number';
				if (tokenOb.style === 'variable' && /^_?[A-Z]/.test(tokenOb.token) && 
					tokenObAhead && tokenObAhead.token === '{')
					return 'class';
				if (tokenOb.style === 'string' || tokenOb.style === 'variable')
					return 'string';
				return false;
			}
		};
	}
	
	function getCurrentReference(cm) {
		var curCursor = cm.getCursor(),
			doc = cm.getDoc(),
			curLine = curCursor.line,
			curCh = curCursor.ch,
			i = 1,
			resString = "",
			charIte;
		while ((charIte = doc.getRange({line: curLine, ch: curCh - i}, 
			{line: curLine, ch: curCh - i + 1})).match(/[\w.?!]/)) {
			resString = charIte + resString;
			i += 1;
		}
		return resString;
	}
	
	function suneidoAutoComplete(cm, callback, options) {
		var word = getCurrentReference(cm),
			cur = cm.getCursor(),
			curToken = cm.getTokenAt(cur),
			content = cm.getDoc().getValue(),
			classHelper = getClassHelper(content),
			matches,
			textNames,
			privateMembers,
			publicMembers,
			allMembers,
			autoCompleteMethod = function() {
				var thisMembers = function(member) {
						if (member === '')
							return allMembers;
						else if (classHelper.isLocalName(member))
							return privateMembers;
						else if (classHelper.isGlobalName(member))
							return publicMembers;
						else
							return [];
					},
					methods = [];
				if (word[0] === '.') {
					methods = thisMembers(word.substring(1));
					word = word.slice(word.lastIndexOf('.') + 1);
					methods = methods.filter(function(element){ return element.startsWith(word); });
					callback({list: methods, from: CodeMirror.Pos(cur.line, curToken.start), 
						to: CodeMirror.Pos(cur.line, curToken.end)});
				} else if (/^[A-Z]/.test(word[0])){
					alert("Request ClassHelp.PublicMembersOfName for " + word);
				} else {
					alert("Request defaultMethods for " + word);
				}									
			},
			autoCompleteWord = function() {
				var words = [],
					counter = 0;
				if (word.length < 3)
					return;
				if (/[A-Z]/.test(word[0])){
					alert("Request LibLocateList.GetMatches for " + word);
					callback({list: ["word"], from: CodeMirror.Pos(cur.line, curToken.start), 
						to: CodeMirror.Pos(cur.line, curToken.end)});
				} else {
					words = textNames.filter(function(element){ return element.startsWith(word) && 
						element !== word && counter++ < 100; });
					callback({list: words, from: CodeMirror.Pos(cur.line, curToken.start), 
						to: CodeMirror.Pos(cur.line, curToken.end)});
				}
			};
		textNames = classHelper.getTextNames();
		if (classHelper.getLibRecordType() === 'class'){
			privateMembers = classHelper.getPrivateMembers();
			publicMembers = classHelper.getPublicMembers();
			allMembers = privateMembers.concat(publicMembers);
		} else {
			privateMembers = [];
			publicMembers = [];
			allMembers = [];
		}
		if (/\./.test(word))
			autoCompleteMethod();
		else
			autoCompleteWord();
	}
});

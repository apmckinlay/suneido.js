(function (mod) {
	"use strict";
	if (typeof exports === "object" && typeof module === "object") { // CommonJS
		mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
	} else if (typeof define === "function" && define.amd) { // AMD
		define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
	} else { // Plain browser env
		mod(CodeMirror);
	}
}(function(CodeMirror){
	"use strict";
	function SearchState(){
		this.posFrom = this.posTo = this.replace = null;
		this.query = "";
		this.searchDialog = this.replaceDialog = null;
		this.searchClose = this.replaceClose = null;
		this.cursor = null;
		
		this.isCaseSensitive = false;
		this.isWholeWord = false;
		this.isRegex = false;
	}
	
	function getSearchState(cm){
		cm.state.search = cm.state.search || new SearchState();
		return cm.state.search;
	}
	
	function parseQuery(queryString, state){
		// /x^/ represents a regex pattern can never be matched
		var isCaseSensitive = state.isCaseSensitive ? "" : "i",
			queryRegex;
		if (typeof queryString !== "string"){
			return /x^/;
		}
		
		if (!state.isRegex){
			queryString = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
		if (state.isWholeWord){
			queryString = "\\b" + queryString + "\\b";
		}
		try {
			queryRegex = new RegExp(queryString, isCaseSensitive);
		}
		catch(err) {
			return /x^/;
		}
		if (queryRegex.test("")){
			queryRegex = /x^/;
		}
		return queryRegex;
	}
	
	function getSearchCursor(cm, queryRegex, pos){
		return cm.getSearchCursor(queryRegex, pos);
	}
	
	function createDialog(cm, template, buttonCallbacks, checkboxCallbacks, options){
		if (cm.openComplex){
			return cm.openComplex(template, buttonCallbacks, checkboxCallbacks, options);
		}
		return null;
	}
	
	function findNext(cm, rev){
		return cm.operation(function () {
			var state = getSearchState(cm),
				queryRegex = parseQuery(state.query, state),
				match;
				
			if (!state.query) {
				return;
			}
			if (!state.cursor) {
				state.cursor = getSearchCursor(cm, queryRegex, cm.getCursor());
			} 
			match = rev ? state.cursor.findPrevious() : state.cursor.findNext();
			
			if (!match) {
				state.cursor = getSearchCursor(cm, queryRegex, rev ? 
					CodeMirror.Pos(cm.lastLine()) : 
					CodeMirror.Pos(cm.firstLine(), 0));
				if (!state.cursor.find(rev)) {
					return "Not found";
				}
			}
			
			cm.setSelection(state.cursor.to(), state.cursor.from());
			cm.scrollIntoView({from: state.cursor.from(), to: state.cursor.to()});
		});
	}
	
	function doReplace(cm, cursor, query, replacement) {
		var match = cm.getRange(cursor.from(), cursor.to()).match(query);
		cursor.replace(
			replacement.replace(/\$(\d)/g, function (_, i) {
				return match[i] || '';
			})
		);
	}

	function replaceCurrent(cm) {
		var state = getSearchState(cm),
			replacement = state.replace || '',
			queryRegex = parseQuery(state.query, state);
		
		if (!state.query || !state.replaceDialog) {
			return;
		}		
		if (!state.cursor) {
			findNext(cm);
		}
		if (state.cursor) {
			doReplace(cm, state.cursor, queryRegex, replacement);
		}
		findNext(cm);
	}

	function replaceAll(cm) {
		var state = getSearchState(cm),
			replacement = state.replace || '',
			queryRegex = parseQuery(state.query, state);

		if (!state.query || !state.replaceDialog) {
			return;
		}
		cm.operation(function () {
			var cursor = getSearchCursor(cm, queryRegex);
			while (cursor.findNext()) {
				doReplace(cm, cursor, queryRegex, replacement);
			}
		});
	}

	function replaceInSelect(cm) {
		var state = getSearchState(cm),
			replacement = state.replace || '',
			queryRegex = parseQuery(state.query, state),
			queryRegexGlobal = new RegExp(queryRegex, 'g');

		if (!state.query || !state.replaceDialog) {
			return;
		}
		cm.operation(function () {
			var selections = cm.getSelections(),
				replacements = [],
				match,
				i;
			for (i = 0; i < selections.length; i++) {
				replacements[i] = selections[i].replace(queryRegexGlobal, function (matchString) {
					match = matchString.match(queryRegex);
					return replacement.replace(/\$(\d)/g, function (_, i) {
						return match[i] || '';
					})
				})
			}
			cm.replaceSelections(replacements, 'around');
		});
	}

	function callSearch(cm) {
		var	state = getSearchState(cm),
			query = cm.getSelection() || state.query || '',
			queryRegex = parseQuery(query, state),
			buildNewSearch = function(queryString){
				state.query = queryString;
				state.cursor = null;
			},
			searchFunc = function(queryString, rev){
				return cm.operation(function(){
					buildNewSearch(queryString);
					return findNext(cm, rev);
				});
			},
			resultObj,
			buttons,
			input,
			i;
		if (!state.searchDialog){
			resultObj = createDialog(cm, searchQueryDialog, 
				[
					function (cm, e, element) {
						return findNext(cm, true); 
					},
					function (cm, e, element) {
						return findNext(cm); 
					},
					function (cm, e, element) {
						state.searchClose();
					},
					function (cm, e, element) {
						addMarks(cm);
					},
					function (cm, e, element) {
						clearMarks(cm);
					}
				],
				[
					function(cm, e, element) {
						state.isCaseSensitive = element.checked;
						return searchFunc(state.query);
					},
					function(cm, e, element) {
						state.isWholeWord = element.checked;
						return searchFunc(state.query);
					},
					function(cm, e, element) {
						state.isRegex = element.checked;
						return searchFunc(state.query);
					}
				],
				{
					value: query,
					selectValueOnOpen: true,
					closeOnEnter: false,
					closeOnBlur: false,
					onClose: function () {
						if (state.searchDialog) {
							state.searchClose();
							state.searchDialog = null;
							state.searchClose = null;
						}
						if (state.replaceDialog) {
							state.replaceClose();
							state.replaceDialog = null;
							state.replaceColse = null;
						}
					},
					onInput: function (e, inputs, close) { return searchFunc(inputs); }
				});
			state.searchDialog = resultObj && resultObj.dialog;
			state.searchClose = resultObj && resultObj.close;
			if (state.searchDialog) {
				state.searchDialog.className = "CodeMirror-dialog CodeMirror-dialog-search";
			}
		} else {
			input = document.getElementById("searchDialog");
			if (input){
				input.value = query;
				input.select();
				input.focus();
			}
		}
		buildNewSearch(query);
	}

	function addMarks(cm) {
		cm.operation(function () {
			var state = getSearchState(cm),
				queryRegex,
				elt;
			cm.clearGutter(searchGutter);
			queryRegex = parseQuery(state.query, state);
			cm.eachLine(function (line) {				
				if (line.text.search(queryRegex) !== -1) {
					elt = document.createElement("div");
					elt.className = "Suneido-searchgutter-marker";
					cm.setGutterMarker(line, searchGutter, elt);
				}
			});
		});
	}

	function clearMarks(cm) {
		cm.operation(function () {
			cm.clearGutter(searchGutter);
		});
	}
	
	function callReplace(cm) {
		if (cm.getOption("readOnly")) { 
			return; 
		}
		var state = getSearchState(cm),
			resultObj,
			buttons,
			i;
		callSearch(cm);
		if (!state.replaceDialog) {
			resultObj = createDialog(cm, replaceQueryDialog, 
			[
				replaceCurrent,
				replaceInSelect,
				replaceAll
			],
			[],
			{
				closeOnEnter: false,
				closeOnBlur: false,
				onClose: function () {
					if (state.searchDialog) {
						state.searchClose();
						state.searchDialog = null;
						state.searchClose = null;
					}
					if (state.replaceDialog) {
						state.replaceClose();
						state.replaceDialog = null;
						state.replaceColse = null;
					}
				},
				onInput: function (e, inputs, close) {
					state.replace = inputs;
				}
			});
			state.replaceDialog = resultObj && resultObj.dialog;
			state.replaceClose = resultObj && resultObj.close;
			state.replace = '';
			if (state.replaceDialog) {
				state.replaceDialog.className = "CodeMirror-dialog CodeMirror-dialog-replace";
			}
		}
	}

	var searchQueryDialog =
		'<lable class="Suneido-search-lable">Find: </lable> \
		<input id="searchDialog" type="text" class="Suneido-search-field"/> \
		<label display: block><input type="checkbox" name="case" /> Case </lable> \
		<label display: block><input type="checkbox" name="word" /> Word </lable> \
		<label display: block><input type="checkbox" name="regex" /> Regex </lable> \
		<input type="button" value="prev" class="Suneido-search-button"> \
		<input type="button" value="next" class="Suneido-search-button"> \
		<input type="button" value="close" class="Suneido-search-button"> \
		<input type="button" value="mark" class="Suneido-search-button"> \
		<input type="button" value="clear" class="Suneido-search-button">';
	var replaceQueryDialog = 
		'<lable class="Suneido-search-lable">Replace: </lable> \
		<input id="replaceDialog" type="text" class="Suneido-search-field"/> \
		<input type="button" value="Replace Current" class="Suneido-search-button"> \
		<input type="button" value="In Select" class="Suneido-search-button"> \
		<input type="button" value="Replace All" class="Suneido-search-button">';
	var searchGutter = 'Suneido-searchgutter';

	CodeMirror.commands.find = function (cm) {
		callSearch(cm);
	};
	CodeMirror.commands.findNext = findNext;
	CodeMirror.commands.findPrev = function (cm) {
		findNext(cm, true);
	};
	CodeMirror.commands.replace = callReplace;
	CodeMirror.commands.replaceAll = replaceAll;
	CodeMirror.commands.replaceCurrent = replaceCurrent;
}));
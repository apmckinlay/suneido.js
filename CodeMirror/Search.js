
(function (mod) {
	"use strict";
	if (typeof exports === "object" && typeof module === "object") // CommonJS
		mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
	else if (typeof define === "function" && define.amd) // AMD
		define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
	else // Plain browser env
		mod(CodeMirror);
})(function (CodeMirror) {
	"use strict";
	function SearchState() {
		this.posFrom = this.posTo = this.replace = null;
		this.query = "";
		this.queryRegexp = parseQuery(this.query);
		this.searchDialog = this.replaceDialog = null;
		this.searchClose = this.replaceClose = null;
		this.cursor = null;
	}

	function getSearchState(cm) {
		return cm.state.search || (cm.state.search = new SearchState());
	}

	function queryCaseInsensitive(query) {
		return typeof query === "string" && query === query.toLowerCase();
	}

	function getSearchCursor(cm, query, pos) {
		// Heuristic: if the query string is all lowercase, do a case insensitive search.
		return cm.getSearchCursor(query, pos, queryCaseInsensitive(query));
	}

	function complexDialog(cm, text, fs, options) {
		if (cm.openComplex) {
			return cm.openComplex(text, fs, options);
		}
	}

	function parseQuery(query) {
		if (typeof query === "string") {
			var isRE = query.match(/^\/(.*)\/([a-z]*)$/),
				isCaseInsensitive;
			if (isRE) {
				try {
					query = new RegExp(isRE[1], isRE[2].indexOf("i") === -1 ? "" : "i");
				} catch (e) {
					query = /x^/;
				}
			} else {
				isCaseInsensitive = queryCaseInsensitive(query);
				try {
					query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), isCaseInsensitive ? "i" : "");
				} catch (e) {
					query = /x^/;
				}
			}
		} else {
			query = /x^/;
		}
		if (query.test("")) {
			query = /x^/;
		}
		return query;
	}

	var queryDialog =
		'Search: <input id="searchDialog" type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span> <button> Prev </button> <button> Next </button> <button> Close </button>';
	var	map = {
		70: false,
		17: false,
		16: false,
		114: false,
		119: false,
		72: false
	}; // Key : "F" , "Ctrl", "Shift", "F3", "F8" and "H"

	function doSearch(cm) {
		var state = getSearchState(cm),
			q = cm.getSelection() || state.query || '',
			buildNewSearch = function (query) {
				state.query = query;
				state.queryRegexp = parseQuery(query);
				if (cm.showMatchesOnScrollbar) {
					if (state.annotate) {
						state.annotate.clear();
						state.annotate = null;
					}
					state.annotate = cm.showMatchesOnScrollbar(state.queryRegexp, queryCaseInsensitive(state.query));
				}
				state.posTo = cm.getCursor();
				state.posFrom = cm.getCursor();
				state.cursor = null;
			},
			searchFunc = function (query, rev) {
				return cm.operation(function () {
					buildNewSearch(query);
					return findNext(cm, rev);
				});
			};
		if (!state.searchDialog) {
			var resultObj = complexDialog(cm, queryDialog, [function (cm) {findNext(cm, true); }, findNext],
				{
					value: q,
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
					onInput: function (e, inputs, close) { return searchFunc(inputs); },
					onKeyDown: function (e, inputs, close) {
						if (map.hasOwnProperty(e.keyCode)) {
							map[e.keyCode] = true;
						}
						if (map[17] && map[70]) {
							doSearch(cm);
							CodeMirror.e_preventDefault(e);
						} else if (map[16] && map[114]) {
							findNext(cm, true);
							CodeMirror.e_preventDefault(e);
						} else if (map[114]) {
							findNext(cm);
							CodeMirror.e_preventDefault(e);
						} else if (map[119]) {
							doReplace(cm);
							CodeMirror.e_preventDefault(e);
						} else if (map[17] && map[72]) {
							replace(cm);
							CodeMirror.e_preventDefault(e);
						}
					},
					onKeyUp : function (e, inputs, close) {
						if (map.hasOwnProperty(e.keyCode)) {
							map[e.keyCode] = false;
						}
					}
				});
			state.searchDialog = resultObj && resultObj.dialog;
			state.searchClose = resultObj && resultObj.close;
			if (state.searchDialog) {
				state.searchDialog.className = "CodeMirror-dialog CodeMirror-dialog-search";
				state.searchDialog.style.width = "700";
				var buttons = state.searchDialog.getElementsByTagName("button");
				for (var i = 0; i < buttons.length; i++)
					buttons[i].className = "CodeMirror-button-search";
			}
		} else {
			var inp = document.getElementById("searchDialog");
			if (inp) {
				inp.value = q;
				inp.select();
				inp.focus();
			}
		}
		buildNewSearch(q);
	}
	
	function findNext(cm, rev) {
		return cm.operation( function() {
			var state = getSearchState(cm);
			if (!state.query) return;
			var cursor = getSearchCursor(cm, state.queryRegexp, rev ? state.posFrom : state.posTo);
			if (!cursor.find(rev)) {
				cursor = getSearchCursor(cm, state.queryRegexp, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
				if (!cursor.find(rev)) return "Not found";
			}
			cm.setSelection(cursor.to(), cursor.from());
			cm.scrollIntoView({from: cursor.from(), to: cursor.to()});
			state.posFrom = cursor.from(); 
			state.posTo = cursor.to();
			state.cursor = cursor;
		});
	}
	function clearSearch(cm) {
		cm.operation(function() {
			var state = getSearchState(cm);
			if (state.annotate) { 
				state.annotate.clear(); 
				state.annotate = null; 
			}
		});
	}

	var replaceAll = function(cm) {
		var state = getSearchState(cm);
		var text = state.replace || '';
		var query = state.query;
		if (!query) return;
		cm.operation(function() {
			for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
				if (typeof query !== "string") {
					var match = cm.getRange(cursor.from(), cursor.to()).match(query);
					cursor.replace(text.replace(/\$(\d)/g, function(_, i) {
						return match[i];
					}));
				} else 
					cursor.replace(text);
			}
		})
	};
	var doReplace = function(cm) {
		var state = getSearchState(cm);
		var text = state.replace || '';
		var query = state.query;
		if (!query || !state.replaceDialog) return;
		if (!state.cursor)
			findNext(cm);
		if (state.cursor)
			state.cursor.replace(typeof query === "string" ? text :
				text.replace(/\$(\d)/g, function(_, i) {
					return match[i];
				}));
		findNext(cm)
	};
	var replaceQueryDialog =
		'Replace: <input id="replaceDialog" type="text" style="width: 28.8em" class="CodeMirror-search-field"/>  <button>Replace Current</button> <button>Replace ALL</button>'
	
	function replace(cm, all) {
		if (cm.getOption("readOnly")) return;
		var state = getSearchState(cm);
		doSearch(cm);
		if (!state.replaceDialog) {
			var resultObj = complexDialog(cm, replaceQueryDialog, [doReplace, replaceAll],
				{ 
					closeOnEnter: false,
					closeOnBlur: false,
					onClose: function(){
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
					onInput: function(e, inputs, close) { 
						state.replace = inputs; 
					},
					onKeyDown: function(e, inputs, close) {
						if (map.hasOwnProperty(e.keyCode))
							map[e.keyCode] = true;
						if (map[17] && map[70]) { 
							doSearch(cm); 
							CodeMirror.e_preventDefault(e); 
						} else if (map[16] && map[114]) { 
							doSearch(cm, true); 
							CodeMirror.e_preventDefault(e); 
						} else if (map[114]) { 
							doSearch(cm); 
							CodeMirror.e_preventDefault(e); 
						} else if (map[119]) { 
							doReplace(cm); 
							CodeMirror.e_preventDefault(e); 
						} else if (map[17] && map[72]) { 
							replace(cm); 
							CodeMirror.e_preventDefault(e); 
						}
					},
					onKeyUp : function(e, inputs, close) { 
						if (map.hasOwnProperty(e.keyCode)) {
							map[e.keyCode] = false;
						}
					}
				});
			state.replaceDialog = resultObj && resultObj.dialog;
			state.replaceClose = resultObj && resultObj.close;
			state.replace = '';
			if (state.replaceDialog) {
				state.replaceDialog.className = "CodeMirror-dialog CodeMirror-dialog-replace";
				state.replaceDialog.style.width = "700";
				var buttons = state.replaceDialog.getElementsByTagName("button");
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].className = "CodeMirror-button-replace";
				}
			}
		}
	}

	CodeMirror.commands.find = function(cm) {
		clearSearch(cm); 
		doSearch(cm);
	};
	CodeMirror.commands.findNext = findNext;
	CodeMirror.commands.findPrev = function(cm) {
		findNext(cm, true);
	};
	CodeMirror.commands.clearSearch = clearSearch;
	CodeMirror.commands.replace = replace;
	CodeMirror.commands.replaceAll = function(cm) {
		replace(cm, true);
	};
});

/*global CodeMirror, document, exports, module, require, define*/
/*jslint browser: true nomen: true*/
(function (mod) {
	"use strict";
	if (typeof exports === "object" && typeof module === "object") { // CommonJS
		mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
	} else if (typeof define === "function" && define.amd) { // AMD
		define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
	} else { // Plain browser env
		mod(CodeMirror);
	}
}(function (CodeMirror) {
	"use strict";
	var queryCaseInsensitive = function (query) {
			return typeof query === "string" && query === query.toLowerCase();
		},
		queryIsRegexp = function (query) {
			return query.match(/^\/(.*)\/([a-z]*)$/);
		},
		parseQuery = function (query) {
			if (typeof query === "string") {
				var isRE = queryIsRegexp(query),
					isCaseInsensitive;
				if (isRE) {
					try {
						query = new RegExp(isRE[1], isRE[2].indexOf("i") === -1 ? "" : "i");
					} catch (e1) {
						query = /x^/;
					}
				} else {
					isCaseInsensitive = queryCaseInsensitive(query);
					try {
						query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), isCaseInsensitive ? "i" : "");
					} catch (e2) {
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
		},
		SearchState = function () {
			this.posFrom = this.posTo = this.replace = null;
			this.query = "";
			this.queryRegexp = parseQuery(this.query);
			this.searchDialog = this.replaceDialog = null;
			this.searchClose = this.replaceClose = null;
			this.cursor = null;
		},
		getSearchState = function (cm) {
			cm.state.search = cm.state.search ||  new SearchState();
			return cm.state.search;
		},
		getSearchCursor = function (cm, query, pos) {
			// Heuristic: if the query string is all lowercase, do a case insensitive search.
			return cm.getSearchCursor(query, pos, queryCaseInsensitive(query));
		},
		complexDialog = function (cm, text, fs, options) {
			if (cm.openComplex) {
				return cm.openComplex(text, fs, options);
			}
		},
		queryDialog =
			'Search: <input id="searchDialog" type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span> <button> Prev </button> <button> Next </button> <button> Close </button>',
		map = { // Key : "F" , "Ctrl", "Shift", "F3", "F8" and "H"
			70: false,
			17: false,
			16: false,
			114: false,
			119: false,
			72: false
		},
		findNext = function (cm, rev) {
			return cm.operation(function () {
				var state = getSearchState(cm),
					cursor = getSearchCursor(cm, state.queryRegexp, rev ? state.posFrom : state.posTo);
				if (!state.query) {return; }
				if (!cursor.find(rev)) {
					cursor = getSearchCursor(cm, state.queryRegexp, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
					if (!cursor.find(rev)) {return "Not found"; }
				}
				cm.setSelection(cursor.to(), cursor.from());
				cm.scrollIntoView({from: cursor.from(), to: cursor.to()});
				state.posFrom = cursor.from();
				state.posTo = cursor.to();
				state.cursor = cursor;
			});
		},
		doReplace = function (cm, cursor, query, replacement) {
			var match = cm.getRange(cursor.from(), cursor.to()).match(query);
			cursor.replace(typeof query === "string" ? replacement :
					replacement.replace(/\$(\d)/g, function (_, i) {
						return match[i] || '';
					})
				);
		},
		replaceAll = function (cm) {
			var state = getSearchState(cm),
				text = state.replace || '',
				query = state.query,
				queryRegexp = state.queryRegexp;
			if (!query || !state.replaceDialog) {return; }
			cm.operation(function () {
				var cursor = getSearchCursor(cm, queryRegexp);
				while (cursor.findNext()) {
					doReplace(cm, cursor, queryIsRegexp(query) ? queryRegexp : query, text);
				}
			});
		},
		replaceCurrent = function (cm) {
			var state = getSearchState(cm),
				text = state.replace || '',
				query = state.query,
				queryRegexp = state.queryRegexp;
			if (!query || !state.replaceDialog) {return; }
			if (!state.cursor) {findNext(cm); }
			if (state.cursor) {
				doReplace(cm, state.cursor, queryIsRegexp(query) ? queryRegexp : query, text);
			}
			findNext(cm);
		},
		search = function (cm) {
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
				},
				resultObj,
				buttons,
				inp,
				i;
			if (!state.searchDialog) {
				resultObj = complexDialog(cm, queryDialog, [function (cm) {findNext(cm, true); }, findNext],
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
								search(cm);
								CodeMirror.e_preventDefault(e);
							} else if (map[16] && map[114]) {
								findNext(cm, true);
								CodeMirror.e_preventDefault(e);
							} else if (map[114]) {
								findNext(cm);
								CodeMirror.e_preventDefault(e);
							} else if (map[119]) {
								replaceCurrent(cm);
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
					buttons = state.searchDialog.getElementsByTagName("button");
					for (i = 0; i < buttons.length; i += 1) {
						buttons[i].className = "CodeMirror-button-search";
					}
				}
			} else {
				inp = document.getElementById("searchDialog");
				if (inp) {
					inp.value = q;
					inp.select();
					inp.focus();
				}
			}
			buildNewSearch(q);
		},
		clearSearch = function (cm) {
			cm.operation(function () {
				var state = getSearchState(cm);
				if (state.annotate) {
					state.annotate.clear();
					state.annotate = null;
				}
			});
		},
		replaceQueryDialog =
			'Replace: <input id="replaceDialog" type="text" style="width: 28.8em" class="CodeMirror-search-field"/>  <button>Replace Current</button> <button>Replace ALL</button>',
		replace = function (cm) {
			if (cm.getOption("readOnly")) {return; }
			var state = getSearchState(cm),
				resultObj,
				buttons,
				i;
			search(cm);
			if (!state.replaceDialog) {
				resultObj = complexDialog(cm, replaceQueryDialog, [replaceCurrent, replaceAll],
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
						},
						onKeyDown: function (e, inputs, close) {
							if (map.hasOwnProperty(e.keyCode)) {
								map[e.keyCode] = true;
							}
							if (map[17] && map[70]) {
								search(cm);
								CodeMirror.e_preventDefault(e);
							} else if (map[16] && map[114]) {
								search(cm, true);
								CodeMirror.e_preventDefault(e);
							} else if (map[114]) {
								search(cm);
								CodeMirror.e_preventDefault(e);
							} else if (map[119]) {
								replaceCurrent(cm);
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
				state.replaceDialog = resultObj && resultObj.dialog;
				state.replaceClose = resultObj && resultObj.close;
				state.replace = '';
				if (state.replaceDialog) {
					state.replaceDialog.className = "CodeMirror-dialog CodeMirror-dialog-replace";
					state.replaceDialog.style.width = "700";
					buttons = state.replaceDialog.getElementsByTagName("button");
					for (i = 0; i < buttons.length; i += 1) {
						buttons[i].className = "CodeMirror-button-replace";
					}
				}
			}
		};

	CodeMirror.commands.find = function (cm) {
		clearSearch(cm);
		search(cm);
	};
	CodeMirror.commands.findNext = findNext;
	CodeMirror.commands.findPrev = function (cm) {
		findNext(cm, true);
	};
	CodeMirror.commands.clearSearch = clearSearch;
	CodeMirror.commands.replace = replace;
	CodeMirror.commands.replaceAll = replaceAll;
	CodeMirror.commands.replaceCurrent = replaceCurrent;
}));

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
		queryRegex = new RegExp(queryString, isCaseSensitive);
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
		return cm.operation(function(){
			var state = getSearchState(cm),
				queryRegex = parseQuery(state.query, state),
				match;
				
			if (!state.query){
				return;
			}
			if (!state.cursor){
				state.cursor = getSearchCursor(cm, queryRegex, cm.getCursor());
			} 
			match = rev ? state.cursor.findPrevious() : state.cursor.findNext();
			
			if (!match){
				state.cursor = getSearchCursor(cm, queryRegex, rev ? 
					CodeMirror.Pos(cm.lastLine()) : 
					CodeMirror.Pos(cm.firstLine(), 0));
				if (!state.cursor.find(rev)){
					return "Not found";
				}
			}
			
			cm.setSelection(state.cursor.to(), state.cursor.from());
			cm.scrollIntoView({from: state.cursor.from(), to: state.cursor.to()});
		});
	}
	
	function callSearch(cm){
		var	state = getSearchState(cm),
			query = cm.getSelection() || state.query || '',
			queryRegex = parseQuery(query, state),
			buildNewSearch = function(queryString){
				state.query = queryString;
				state.cursor = null;
				if (cm.showMatchesOnScrollbar){
					if (state.annotate){
						state.annotate.clear();
						state.annotate = null;
					}
					state.annotate = cm.showMatchesOnScrollbar(queryRegex);
				}
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
			resultObj = createDialog(cm, queryDialog, 
				[
					function (cm, e, element) {
						return findNext(cm, true); 
					},
					function (cm, e, element) {
						return findNext(cm); 
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
				state.searchDialog.style.width = "700";
				buttons = state.searchDialog.getElementsByTagName("button");
				for (i = 0; i < buttons.length; i += 1) {
					buttons[i].className = "CodeMirror-button-search";
				}
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
	
	function clearSearch(cm) {
		cm.operation(function () {
			var state = getSearchState(cm);
			if (state.annotate) {
				state.annotate.clear();
				state.annotate = null;
			}
		});
	}
	
	var queryDialog =
			'Find: <input id="searchDialog" type="text" style="width: 10em" class="CodeMirror-search-field"/> \
			<input type="checkbox" name="case"> Case \
			<input type="checkbox" name="word"> Word \
			<input type="checkbox" name="regex"> Regex \
			<input type="button" value="prev"> \
			<input type="button" value="next"> \
			<input type="button" value="close">';
	
	CodeMirror.commands.find = function (cm) {
		clearSearch(cm);
		callSearch(cm);
	};
	CodeMirror.commands.findNext = findNext;
	CodeMirror.commands.findPrev = function (cm) {
		findNext(cm, true);
	};
	CodeMirror.commands.clearSearch = clearSearch;
}));
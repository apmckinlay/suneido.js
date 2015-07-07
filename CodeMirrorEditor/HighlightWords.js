(function(mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
	else if (typeof define == "function" && define.amd) // AMD
		define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
	else // Plain browser env
		mod(CodeMirror);
})(function(CodeMirror) {
	"use strict";
	function HighlightWordsState() {
		this.overlay = null;
	}
	function getHighlightWordsState(cm) {
		return cm.state.highlightWords || (cm.state.highlightWords = new HighlightWordsState());
	}
	function searchAdjacentWord(cm) {
		var doc = cm.getDoc();
		var state = getHighlightWordsState(cm);
		var autoIndicatorOverlay = function(query) {
			return {token: function(stream) {
				query.lastIndex = stream.pos;
				var match = query.exec(stream.string);
				if (match && match.index == stream.pos) {
					stream.pos += match[0].length;
					return "indicator";
				} else if (match) {
					stream.pos = match.index;
				} else {
					stream.skipToEnd();
				}
			}};
		};
		var curCursor = cm.getCursor();
		var i = 1, j = 1;
		while (doc.getRange({line: curCursor.line, ch: curCursor.ch-i}, {line: curCursor.line, ch: curCursor.ch-i+1}).match(/[\d\w_]/))
			i++;
		while (doc.getRange({line: curCursor.line, ch: curCursor.ch+j-1}, {line: curCursor.line, ch: curCursor.ch+j}).match(/[\d\w_]/))
			j++;
		cm.removeOverlay(state.overlay);
		if (i != 1 || j != 1) {
			var mydef_matchCounter = 0;
			var content = doc.getValue();
			var query = doc.getRange({line: curCursor.line, ch: curCursor.ch-i+1}, {line: curCursor.line, ch: curCursor.ch+j-1});
			query = new RegExp('\\b' + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '\\b', "g");
			var match = content.match(query);
			if (match && match.length >= 2) {
				state.overlay = autoIndicatorOverlay(query);
				cm.addOverlay(state.overlay);
			}
		}
	}
	CodeMirror.defineOption("highlightWords", false, function(cm, val, old) {
		if (old && old != CodeMirror.Init)
		   cm.off("cursorActivity", searchAdjacentWord);
		if (val) {
		   cm.on("cursorActivity", searchAdjacentWord);
		}
	});
});

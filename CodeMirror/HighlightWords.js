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
    var HighlightWordsState = function () {
			this.overlay = null;
			this.tail = '';
		},
		getHighlightWordsState = function (cm) {
			cm.state.highlightWords = cm.state.highlightWords || new HighlightWordsState();
			return cm.state.highlightWords;
		},
		searchAdjacentWord = function (cm) {
			var doc = cm.getDoc(),
				state = getHighlightWordsState(cm),
				curCursor = cm.getCursor(),
				i = 1,
				j = 1,
				curLine = curCursor.line,
				curCh = curCursor.ch,
				leftChar = doc.getRange({line: curLine, ch: curCh - 1},
					{line: curLine, ch: curCh}),
				rightChar = doc.getRange({line: curLine, ch: curCh},
					{line: curLine, ch: curCh + 1}),
				mydef_matchCounter,
				content,
				query,
				tailQuery,
				queryRegexp,
				match,
				autoIndicatorOverlay = function () {
					return {token: function (stream) {
						queryRegexp.lastIndex = stream.pos;
						var match = queryRegexp.exec(stream.string);
						if (match && match.index === stream.pos) {
							stream.pos += match[state.tail ? 0 : 1].length;
							return "indicator";
						}
						if (match) {
							stream.pos = match.index;
						} else {
							stream.skipToEnd();
						}
					}};
				};
			state.tail = '';
			if (leftChar && leftChar.match(/[?!]/) && (!rightChar || rightChar.match(/[^\w]/))) {
				curCh -= 1;
			}
			while (doc.getRange({line: curLine, ch: curCh - i}, {line: curLine, ch: curCh - i + 1}).match(/[\w]/)) {
				i += 1;
			}
			while (doc.getRange({line: curLine, ch: curCh + j - 1}, {line: curLine, ch: curCh + j}).match(/[\w]/)) {
				j += 1;
			}
			state.tail = doc.getRange({line: curLine, ch: curCh + j - 1}, {line: curLine, ch: curCh + j}).match(/[?!]/);

			cm.removeOverlay(state.overlay);
			if (i !== 1 || j !== 1) {
				mydef_matchCounter = 0;
				content = doc.getValue();
				query = doc.getRange({line: curLine, ch: curCh - i + 1}, {line: curLine, ch: curCh + j - 1});
				tailQuery = (state.tail && ('\\' + state.tail[0])) || '(?:[^!?]|$)';
				queryRegexp = new RegExp('\\b(' + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')\\b' + tailQuery, "g");
				match = content.match(queryRegexp);
				if (match && match.length >= 2) {
					state.overlay = autoIndicatorOverlay();
					cm.addOverlay(state.overlay);
				}
			}
		};

    CodeMirror.defineOption("highlightWords", false, function (cm, val, old) {
        if (old && old !== CodeMirror.Init) {
			cm.off("cursorActivity", searchAdjacentWord);
		}
        if (val) {
            cm.on("cursorActivity", searchAdjacentWord);
        }
    });
}));

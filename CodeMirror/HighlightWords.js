(function (mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";
    function HighlightWordsState() {
        this.overlay = null;
		this.tail = '';
    }

    function getHighlightWordsState(cm) {
        return cm.state.highlightWords || (cm.state.highlightWords = new HighlightWordsState());
    }

    function searchAdjacentWord(cm) {
        var doc = cm.getDoc();
		var state = getHighlightWordsState(cm);
		state.tail = '';
		var autoIndicatorOverlay = function() {
			return {token: function(stream) {
				queryRegexp.lastIndex = stream.pos;
				var match = queryRegexp.exec(stream.string);
				if (match && match.index == stream.pos) {
					stream.pos += match[state.tail ? 0 : 1].length;
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
		var curLine = curCursor.line, curCh = curCursor.ch;
		var leftChar = doc.getRange({line: curLine, ch: curCh - 1}, 
			{line: curLine, ch: curCh});
		var	rightChar = doc.getRange({line: curLine, ch: curCh}, 
			{line: curLine, ch: curCh + 1})
		if (leftChar && leftChar.match(/[?!]/) && (!rightChar || rightChar.match(/[^\d\w]/)))
			curCh -= 1;
        while (doc.getRange({line: curLine, ch: curCh - i}, 
			{line: curLine, ch: curCh - i + 1}).match(/[\d\w]/))
            i++;
        while (doc.getRange({line: curLine, ch: curCh + j - 1}, 
			{line: curLine, ch: curCh + j}).match(/[\d\w]/))
            j++;
		state.tail = doc.getRange({line: curLine, ch: curCh + j - 1}, 
			{line: curLine, ch: curCh + j}).match(/[?!]/);
			
        cm.removeOverlay(state.overlay);
        if (i != 1 || j != 1) {
            var mydef_matchCounter = 0;
            var content = doc.getValue();
            var query = doc.getRange({line: curLine, ch: curCh - i + 1}, 
				{line: curLine, ch: curCh + j - 1});
			var tailQuery= (state.tail && ('\\' + state.tail[0])) || '(?:[^!?]|$)';
            var queryRegexp = new RegExp('\\b(' + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')\\b' + tailQuery, "g");
			var match = content.match(queryRegexp);
            if (match && match.length >= 2) {
                state.overlay = autoIndicatorOverlay();
                cm.addOverlay(state.overlay);
            }
        }
    }

    CodeMirror.defineOption("highlightWords", false, function (cm, val, old) {
        if (old && old != CodeMirror.Init)
            cm.off("cursorActivity", searchAdjacentWord);
        if (val) {
            cm.on("cursorActivity", searchAdjacentWord);
        }
    });
});

// Copyright (C) 2015 Suneido Software Corp. All rights reserved worldwide.

(function (mod) {
	"use strict";
    mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    CodeMirror.defineMode("suneido", function (config) {
        function words(str) {
            var obj = {},
				wordsArray = str.split(" "),
				i;
            for (i = 0; i < wordsArray.length; i++) {
				obj[wordsArray[i]] = true;
			}
            return obj;
        }

        var indentUnit = config.indentUnit,
			isOperatorChar = /[+\-*&%=<>!?|\/$]/,
			keywords = words("and bool break buffer callback char" +
				" continue default dll double false float forever" +
				" gdiobj handle in int16 int32 int64 int8 isnt is" +
				" long new not or pointer resource return short string" +
				" super this throw true void xor" +
				" if else for function while do switch case class struct try catch"),
			controlStart = /^[ \t]*(if|else|for|function|while|do|switch|case|class|struct|try|catch)/,
			curPunc,
			onlyCurly,
			opening,
			closing,
			controlLine;

		function tokenVariable(stream) {
			stream.eatWhile(/[\d\w]/);

			stream.match(/[?!]/, true);
			var cur = stream.current();
			if (keywords.propertyIsEnumerable(cur)) {
                return "keyword";
            }
			return "variable";
		}

		function tokenNumber(stream, state) {
			if (stream.match("0x", true, true)) {
				stream.eatWhile(/[0-9a-fA-F]/);
			} else {
				stream.eatWhile(/\d/);
				if (stream.eat('.')) {
					stream.eatWhile(/\d/);
				}
				if (stream.eat(/[eE]/)) {
					stream.eatWhile(/\d/);
				}
			}
			state.tokenize = null;
			return "number";
		}

        function tokenString(quote) {
            return function (stream, state) {
                var escaped = false, next, end = false;
                while ((next = stream.next()) !== null) {
                    if (next === quote && !escaped) {
                        end = true;
                        break;
                    }
                    escaped = !escaped && next === "\\";
                }
                if (end) {
					state.tokenize = null;
				}
                return "string";
            };
        }

        function tokenComment(stream, state) {
            var maybeEnd = false,
				ch = state.next();
            while (ch) {
                if (ch === "/" && maybeEnd) {
                    state.tokenize = null;
                    break;
                }
                maybeEnd = (ch === "*");
				ch = stream.next();
            }
            return "comment";
        }

		function tokenBase(stream, state) {
            var ch = stream.next();
            if (ch === '"' || ch === "'" || ch === '`') {
                state.tokenize = tokenString(ch);
                return state.tokenize(stream, state);
            }
            if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
                curPunc = ch;
                return null;
            }
            if (/\d/.test(ch)) {
                return tokenNumber(stream, state);
            }
			if (/\w/.test(ch)) {
				return tokenVariable(stream);
			}
            if (ch === "/") {
                if (stream.eat("*")) {
                    state.tokenize = tokenComment;
                    return tokenComment(stream, state);
                }
                if (stream.eat("/")) {
                    stream.skipToEnd();
                    return "comment";
                }
            }
            if (isOperatorChar.test(ch)) {
                stream.eatWhile(isOperatorChar);
                return "operator";
            }

            return null;
        }

        // Interface
        return {
            startState: function () {
                return {
                    tokenize: null,
                    indented: 0,
                    startOfLine: true
                };
            },

            token: function (stream, state) {
                curPunc = null;
                if (stream.sol()) {
                    state.indented = stream.indentation();
                    state.startOfLine = true;
                }
                if (stream.eatSpace()) {
                    return null;
                }
                var style = (state.tokenize || tokenBase)(stream, state);

                onlyCurly = state.startOfLine === true && curPunc === "{";
                opening = /([\{])[^\}]*$|([\(])[^\)]*$|([\[])[^\]]*$/.test(stream.string);
                closing = /([\}])[^\{]*$|([\)])[^\(]*$|([\]])[^\[]*$/.test(stream.string);
                controlLine = controlStart.test(stream.string);

                state.startOfLine = false;
                return style;
            },

            indent: function (state, textAfter) {
                if ((!onlyCurly && textAfter.length !== 0) || (!onlyCurly && opening) || controlLine) {
                    return state.indented + indentUnit;
                }
                if ((closing)) {
                    return state.indented - indentUnit;
                }
                return state.indented;
            },

            dontIndentStates: ["comment"],
            lineComment: "//",
            blockCommentStart: "/*",
            blockCommentEnd: "*/",
            fold: "brace",
            closeBrackets: "()[]{}''\"\"``"
        };
    });
});

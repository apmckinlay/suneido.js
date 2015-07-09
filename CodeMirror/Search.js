(function (mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";
    function searchOverlay(query, caseInsensitive) {
        if (typeof query == "string")
            query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
        else if (!query.global)
            query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

        return {
            token: function (stream) {
                query.lastIndex = stream.pos;
                var match = query.exec(stream.string);
                if (match && match.index == stream.pos) {
                    stream.pos += match[0].length;
                    return "searching";
                } else if (match) {
                    stream.pos = match.index;
                } else {
                    stream.skipToEnd();
                }
            }
        };
    }

    function SearchState() {
        this.posFrom = this.posTo = this.lastQuery = this.query = this.replace = null;
        this.overlay = null;
        this.searchDialog = this.replaceDialog = null;
        this.replaceClose = null;
        this.cursor = null;
    }

    function getSearchState(cm) {
        return cm.state.search || (cm.state.search = new SearchState());
    }

    function queryCaseInsensitive(query) {
        return typeof query == "string" && query == query.toLowerCase();
    }

    function getSearchCursor(cm, query, pos) {
        // Heuristic: if the query string is all lowercase, do a case insensitive search.
        return cm.getSearchCursor(query, pos, queryCaseInsensitive(query));
    }

    function complexDialog(cm, text, shortText, deflt, fs, options) {
        if (cm.openComplex) return cm.openComplex(text, fs, options);
        else options.onInput(prompt(shortText, deflt));
        return null;
    }

    function parseQuery(query) {
        var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
        if (isRE) {
            try {
                query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i");
            }
            catch (e) {
            } // Not a regular expression after all, do a string search
        }
        if (typeof query == "string" ? query == "" : query.test(""))
            query = /x^/;
        return query;
    }

    var queryDialog =
        'Search: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span> <button> Prev </button> <button> Next </button> <button> Close </button>';
    var map = {
        70: false,
        17: false,
        16: false,
        114: false,
        119: false,
        72: false
    } // Key : "F" , "Ctrl", "Shift", "F3", "F8" and "H"
    function doSearch(cm, rev) {
        var state = getSearchState(cm);
        var q = cm.getSelection() || state.lastQuery;
        var searchFunc = function (query, rev) {
            cm.operation(function () {
                if (!query /*|| state.query*/) {
                    clearSearch(cm);
                    return;
                }
                state.query = parseQuery(query);
                cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
                state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
                cm.addOverlay(state.overlay);
                if (cm.showMatchesOnScrollbar) {
                    if (state.annotate) {
                        state.annotate.clear();
                        state.annotate = null;
                    }
                    state.annotate = cm.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
                }
                state.posTo = state.posFrom || cm.getCursor();
                state.posFrom = state.posTo || cm.getCursor();
                state.cursor = null;
                findNext(cm, rev);
            });
        };
        if (state.query) findNext(cm, rev);
        if (!state.searchDialog) {
            var resultObj = complexDialog(cm, queryDialog, "Search for:", q, [function (cm) {
                    findNext(cm, true);
                }, findNext],
                {
                    value: q,
                    selectValueOnOpen: true,
                    closeOnEnter: false,
                    closeOnBlur: false,
                    onClose: function () {
                        state.searchDialog = null;
                        if (state.replaceDialog) {
                            state.replaceClose();
                            state.replaceDialog = null;
                            state.replaceColse = null;
                        }
                    },
                    bottom: true,
                    onInput: function (e, inputs, close) {
                        searchFunc(inputs);
                    },
                    onKeyDown: function (e, inputs, close) {
                        if (e.keyCode in map)
                            map[e.keyCode] = true;
                        if (map[17] && map[70]) {
                            doSearch(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[16] && map[114]) {
                            doSearch(cm, true);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[114]) {
                            doSearch(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[119]) {
                            doReplace(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[17] && map[72]) {
                            replace(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                    },
                    onKeyUp: function (e, inputs, close) {
                        if (e.keyCode in map) map[e.keyCode] = false
                    }
                });
            state.searchDialog = resultObj && resultObj.dialog;
        } else {
            var inp = state.searchDialog.getElementsByTagName("input")[0];
            if (inp) {
                inp.value = q;
                inp.select();
                inp.focus();
                searchFunc(inp.value);
            }
        }
    }

    function findNext(cm, rev) {
        cm.operation(function () {
            var state = getSearchState(cm);
            if (!state.query) return;
            var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
            if (!cursor.find(rev)) {
                cursor = getSearchCursor(cm, state.query, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
                if (!cursor.find(rev)) return;
            }
            cm.setSelection(cursor.from(), cursor.to());
            cm.scrollIntoView({from: cursor.from(), to: cursor.to()});
            state.posFrom = cursor.from();
            state.posTo = cursor.to();
            state.cursor = cursor;
        });
    }

    function clearSearch(cm) {
        cm.operation(function () {
            var state = getSearchState(cm);
            state.lastQuery = state.query;
            if (!state.query) return;
            state.query = null;
            cm.removeOverlay(state.overlay);
            if (state.annotate) {
                state.annotate.clear();
                state.annotate = null;
            }
        });
    }

    var replaceAll = function (cm) {
        var state = getSearchState(cm);
        var text = state.replace || '';
        var query = state.query;
        if (!query) return;
        cm.operation(function () {
            for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
                if (typeof query != "string") {
                    var match = cm.getRange(cursor.from(), cursor.to()).match(query);
                    cursor.replace(text.replace(/\$(\d)/g, function (_, i) {
                        return match[i];
                    }));
                } else cursor.replace(text);
            }
        })
    };
    var doReplace = function (cm) {
        var state = getSearchState(cm);
        var text = state.replace || '';
        var query = state.query;
        if (!query) return;
        if (!state.cursor)
            findNext(cm);
        if (state.cursor)
            state.cursor.replace(typeof query == "string" ? text :
                text.replace(/\$(\d)/g, function (_, i) {
                    return match[i];
                }));
        findNext(cm)
    };
    var replaceQueryDialog =
        'Replace: <input type="text" style="width: 10em" class="CodeMirror-search-field"/>  <button>Replace Current</button> <button>Replace ALL</button>'

    function replace(cm, all) {
        if (cm.getOption("readOnly")) return;
        var state = getSearchState(cm);
        if (!state.searchDialog)
            doSearch(cm);
        if (!state.replaceDialog) {
            var resultObj = complexDialog(cm, replaceQueryDialog, "Replace:", "", [doReplace, replaceAll],
                {
                    closeOnEnter: false,
                    closeOnBlur: false,
                    onInput: function (e, inputs, close) {
                        state.replace = inputs;
                    },
                    onKeyDown: function (e, inputs, close) {
                        if (e.keyCode in map)
                            map[e.keyCode] = true;
                        if (map[17] && map[70]) {
                            doSearch(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[16] && map[114]) {
                            doSearch(cm, true);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[114]) {
                            doSearch(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[119]) {
                            doReplace(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                        else if (map[17] && map[72]) {
                            replace(cm);
                            CodeMirror.e_preventDefault(e);
                        }
                    },
                    onKeyUp: function (e, inputs, close) {
                        if (e.keyCode in map) map[e.keyCode] = false
                    }
                });
            state.replaceDialog = resultObj && resultObj.dialog;
            state.replaceClose = resultObj && resultObj.close;
            state.replace = '';
        }
    }

    CodeMirror.commands.find = function (cm) {
        clearSearch(cm);
        doSearch(cm);
    };
    CodeMirror.commands.findNext = doSearch;
    CodeMirror.commands.findPrev = function (cm) {
        doSearch(cm, true);
    };
    CodeMirror.commands.clearSearch = clearSearch;
    CodeMirror.commands.replace = replace;
    CodeMirror.commands.replaceAll = function (cm) {
        replace(cm, true);
    };
});

"use strict";
function SuneidoEditor(targetDiv, cusConfigs = {}){
	function getDefault(member){
		return cusConfigs[member] || defconfigs[member];
	}
	
	function initModeAndTheme(){
		cm.setOption("mode", getDefault("mode"));
		cm.setOption("theme", getDefault("theme"));
	}
	
	function initExtraKeys(){
		cm.setOption("extraKeys", getDefault("extraKeys"));
	}
	
	function initStyle(){
		cm.setOption("lineNumbers", getDefault("lineNumbers"));
		cm.setOption("lineWrapping", getDefault("lineWrapping"));
		cm.setOption("indentUnit", getDefault("indentUnit"));
		cm.setOption("indentWithTabs", getDefault("indentWithTabs"));
		cm.setOption("matchBrackets", getDefault("matchBrackets"));
		cm.setOption("foldGutter", getDefault("foldGutter"));
		cm.setOption("gutters", getDefault("gutters"));
		cm.setOption("autoCloseBrackets", getDefault("autoCloseBrackets"));
		cm.setOption("highlightWords", getDefault("highlightWords"));
		cm.setOption("styleActiveLine", getDefault("styleActiveLine"));
	}
	
	function initAutoCompletion(){
		cm.setOption("autoCompletion", getDefault("autoCompletion"));
	}
	var defconfigs = {
		mode: "suneido",
		theme: "suneido",
		lineNumbers: true,
		lineWrapping: true,
		indentUnit: 4,
		indentWithTabs: true,
		extraKeys: {"Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
					"Ctrl-F": "find",
					"F3": "findNext",
					"Shift-F3": "findPrev",
					"Ctrl-H": "replace",
					"Shift-Ctrl-H": "replaceAll",
					"F8": "replaceCurrent",
					"Ctrl-/": "toggleComment",
					"Shift-Ctrl-/": function (cm) {
				var from = cm.getCursor("from"),
					to = cm.getCursor("to");
				if (cm.uncomment(from, to) === false) {
					cm.blockComment(from, to, {fullLines: false});
				}
			}},
		matchBrackets : true,
		foldGutter: true,
		gutters: ["Suneido-searchgutter", "CodeMirror-foldgutter", "CodeMirror-linenumbers"],
		highlightWords : true,
		autoCloseBrackets: true,
		styleActiveLine: true,
		autoCompletion: true
	},
	cm,
	$editor,
	$textarea;
	
	$editor = $(targetDiv);
	$textarea = $("<textarea>");
	$textarea.get(0).value = "//Suneido web Editor\r\n";
	$textarea.appendTo($editor);

	cm = CodeMirror.fromTextArea($textarea.get(0));
	
	initModeAndTheme();
	initStyle();
	initExtraKeys();
	initAutoCompletion();
	
	$editor.on("keydown", ".CodeMirror-dialog",function(e){
		if(e.ctrlKey || (e.keyCode <= 123 && e.keyCode >= 112)){
			cm.triggerOnKeyDown(e);
			return false;
		}
		return true;
	});
	
	return cm;
}

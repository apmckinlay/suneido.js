// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Open simple dialogs on top of an editor. Relies on dialog.css.

(function(mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		mod(require("../../lib/codemirror"));
	else if (typeof define == "function" && define.amd) // AMD
		define(["../../lib/codemirror"], mod);
	else // Plain browser env
		mod(CodeMirror);
})(function(CodeMirror) {
	function dialogDiv(cm, template) {
		var wrap = cm.getWrapperElement();
		var dialog;
		dialog = wrap.appendChild(document.createElement("div"));

		if (typeof template == "string") {
			dialog.innerHTML = template;
		} else { // Assuming it's a detached DOM element.
			dialog.appendChild(template);
		}
		return dialog;
	}
	CodeMirror.defineExtension("openComplex", function(template, callbacks, options) {
		if (!options) options = {};
		var dialog = dialogDiv(this, template);
		var closed = false, me = this, blurring = 1;
		function close(newVal) {
			if (typeof newVal == 'string') {
				inp.value = newVal;
			} else {
				if (closed) return;
				closed = true;
				dialog.parentNode.removeChild(dialog);
				me.focus();
				if (options.onClose) 
					options.onClose(dialog);
			}
		}

		var inp = dialog.getElementsByTagName("input")[0];
		if (inp) {
			if (options.value) {
				inp.value = options.value;
				if (options.selectValueOnOpen !== false) {
					inp.select();
				}
			}

			if (options.onInput)
				CodeMirror.on(inp, "input", function(e) { options.onInput(e, inp.value, close); });
			if (options.onKeyUp)
				CodeMirror.on(dialog, "keyup", function(e) {options.onKeyUp(e, inp.value, close);});

			CodeMirror.on(dialog, "keydown", function(e) {
				if (options && options.onKeyDown) options.onKeyDown(e, inp.value, close);
				if (e.keyCode == 27 || (options.closeOnEnter !== false && e.keyCode == 13)) {
					inp.blur();
					close();
					CodeMirror.e_stop(e);
				}
				if (e.keyCode == 13) {CodeMirror.e_stop(e); me.focus()};
			});

			if (options.closeOnBlur !== false) CodeMirror.on(inp, "blur", close);
			inp.focus();
		}
		var buttons = dialog.getElementsByTagName("button");
		if (buttons) {
			for (var i = 0; i < buttons.length; ++i) {
				var b = buttons[i];
				(function(callback) {
					CodeMirror.on(b, "click", function(e) {
						CodeMirror.e_preventDefault(e);
						if (callback)
							callback(me);
						else
							(function() {
								close();
								me.focus();
							})();
					});
				})(callbacks[i]);
				CodeMirror.on(b, "blur", function() {
					--blurring;
					setTimeout(function() { if (blurring <= 0) { close();} }, 200);
				});
				CodeMirror.on(b, "focus", function() { ++blurring; });
			}
		}
		return {close: close, dialog: dialog};
	});
});

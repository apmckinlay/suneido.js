import CodeMirror from 'codemirror';
import 'codemirror/addon/display/rulers';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/selection/active-line.js';
import './Suneido.js';

// Expose CodeMirror globally for browser usage
window.CodeMirror = CodeMirror;

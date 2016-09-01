// import will run code

console.log("calling convention");
import "./callconvtest"; // has to be first due to module issues
import "./porttests_test";
console.log("dnum_test");
import "./dnum_test";
console.log("su_test");
import "./su_test";
console.log("sudate_test");
import "./sudate_test";
console.log("suobject_test");
import "./suobject_test";
console.log("strings_test");
import "./builtin/strings_test";
console.log("tr_test");
import "./tr_test";
console.log("lexer_test");
import "./lexer_test";
console.log("charmatcher_test");
import "./charmatcher_test";

console.log("finished");
process.exit();

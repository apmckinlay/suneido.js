export var assert = function(condition: any, message: string): void {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

export var except = function (message: string): void {
    throw new Error(message);
}

export var assertEq = function (op1: any, op2: any): void {
    var message = "Assertion failed: ";
    if (op1 !== op2) {
        message += "expected " + (op2.toString && op2.toString() || '') +
        " but it was " + (op1.toString && op1.toString() || '');
        if (typeof Error !== "undefined") {
            throw new Error(message); 
        }
        throw message;
    }
}

export var unreachable = function (): void {
    except("should not reach here!");
}
export function isAlpha(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122))) {
            return true;
        }
    }
    return false;
}

export function isDigit(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code >= 48) && (code <= 57)) {
            return true;
        }
    }
    return false;
}

export function isAlnum(char: string): boolean {
    return isAlpha(char) || isDigit(char);
}

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function isLower(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code > 96) && (code < 123))
            return true;
    }
    return false;
}

export function isUpper(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code > 64) && (code < 91))
            return true;
    }
    return false;
}
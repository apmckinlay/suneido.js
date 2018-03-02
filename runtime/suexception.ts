export class SuException extends Error {
    constructor(message: string, cause?: Error, isSuneidoRethrown: boolean = false) {
        super(SuException.makeMessage(message, cause, isSuneidoRethrown));
    }

    private static makeMessage(message: string, cause?: Error, isSuneidoRethrown: boolean = false): string {
        if (isSuneidoRethrown || !cause)
            return message;
        else
            return `${message} (${cause.message})`;
    }
}

export function err(s: string): never {
    throw new SuException(s);
}

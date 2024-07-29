class BlockReturn extends Error {
    public name: 'BlockReturn';
    constructor(public id: number, public value: any) {
        super('BlockReturn')
    }
}
export function blockreturn(id: number, value: any): BlockReturn {
    return new BlockReturn(id, value);
}
export function blockReturnHandler(err: any, id: number) {
    if (err instanceof BlockReturn && err.id === id)
        return err.value;
    throw err;
}
export function rethrowBlockReturn(err: any) {
    if (err instanceof BlockReturn)
        throw err;
}

export function isBlockReturn(e: any): boolean {
    return e instanceof BlockReturn;
}

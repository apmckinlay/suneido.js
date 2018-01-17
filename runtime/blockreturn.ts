class BlockReturn {
    constructor(public id: number, public value: any) {}
}
export function blockreturn(id: number, value: any): BlockReturn {
    return new BlockReturn(id, value);
}
export function blockReturnHandler(err: any, id: number) {
    if (err instanceof BlockReturn && err.id === id)
        return err.value;
    throw err;
}

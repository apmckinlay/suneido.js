export class Dynamic {
    private static stack: Map<string, any>[] = [];
    private static getStack(): Map<string, any>[] {
        if (Dynamic.stack.length === 0)
            Dynamic.stack.push(new Map());
        return Dynamic.stack;
    }

    private static peek(): Map<string, any> {
        let stack = Dynamic.getStack();
        return stack[stack.length - 1];
    }

    public static put(name: string, value: any) {
        Dynamic.peek().set(name, value);
    }

    public static get(name: string) {
        let value = Dynamic.getOrUndefined(name);
        if (value === undefined)
            throw new Error("uninitialized " + name);
        return value;
    }

    public static getOrUndefined(name: string): any {
        let stack = Dynamic.getStack();
        for (let i = stack.length - 1; i >= 0; --i) {
            let value = stack[i].get(name);
            if (value !== undefined)
                return value;
        }
        return undefined;
    }

    public static push() {
        Dynamic.getStack().push(new Map());
    }

    public static pop() {
        Dynamic.getStack().pop();
    }
}

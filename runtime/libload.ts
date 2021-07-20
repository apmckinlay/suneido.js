export function libload(name: string) {
    if ((window as any)?.suCodeBundle && (window as any).suCodeBundle[name]) {
        return ((window as any).suCodeBundle[name])();
    }
    let req = new XMLHttpRequest();
    req.open("GET", "/load?" + name, false); // synchronous
    req.send();
    if (req.status !== 200)
        throw new Error("can't find " + name);
    try {
        return eval(req.responseText);
    } catch (e) {
        throw new Error("error loading " + name);
    }
}

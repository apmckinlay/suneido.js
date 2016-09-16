export function libload(name: string) {
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

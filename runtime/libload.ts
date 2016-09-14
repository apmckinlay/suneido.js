export function libload(name: string) {
    let req = new XMLHttpRequest();
    req.open("GET", "/load?" + name, false); // synchronous
    req.send();
    if (req.status !== 200)
        throw new Error("can't find " + name);
    return eval(req.responseText);
}

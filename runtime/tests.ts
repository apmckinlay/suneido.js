for (let i = 2; i < process.argv.length; i++) {
    let file = process.argv[i].slice(8); // strip 'runtime/'
    console.log(file);
    require("./" + file);
}
console.log("finished");
process.exit();

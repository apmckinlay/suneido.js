import * as fs from "fs";

import "../runtime/globals";
import { listGlobals } from "../runtime/global";

let dest = process.argv[2]
fs.writeFileSync(dest, JSON.stringify(listGlobals()));


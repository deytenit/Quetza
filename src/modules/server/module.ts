import path from "path";
import { fileURLToPath } from "url";

const name = "server";
const description = "Server utilities module";
const author = "unknowableshade";
const tag = "0.0.1";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export { author, description, name, rootDir, tag };

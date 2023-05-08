import path from "path";
import { fileURLToPath } from "url";

const name = "core";
const description = "Quetza core functionality";
const author = "unknowableshade";
const tag = "4.2.0";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export { author, description, name, rootDir, tag };

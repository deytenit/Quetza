import path from "path";
import { fileURLToPath } from "url";

import Music from "./lib/music.js";

const name = "music";
const description = "Music module";
const author = "unknowableshade";
const tag = "2.0.0";

const controller = new Music();

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export { author, controller, description, name, rootDir, tag };

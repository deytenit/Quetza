import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const config = {
    discordToken: process.env.DISCORD_TOKEN,
    modulesDir: path.join(ROOT, "/modules/"),
    binariesDir: path.join(ROOT, "/../bin/")
};

export default config;

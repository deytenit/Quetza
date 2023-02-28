import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
    discordToken:
        process.env.DISCORD_TOKEN ??
        "NzgzNDQwMjU3NjE3MzYyOTQ1.Ghtbbs.kCCj2thmuKu5MsThHGSV5O0UUAFO3bwPlnQ1PM",
    modulesDir: path.join(__dirname, "/modules/"),
    binariesDir: path.join(__dirname, "/../bin/")
};

export default config;

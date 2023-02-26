import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
    token:
        process.env.DISCORD_TOKEN ??
        "NzgzNDQwMjU3NjE3MzYyOTQ1.GQ0lLK.VftrGanpOtqfoKUQRkoXDCcbQqwMqBsybmwjGE",
    commands: path.join(__dirname, "/commands/"),
    events: path.join(__dirname, "/events/"),
    binaries: path.join(__dirname, "/../bin/")
};

export default config;

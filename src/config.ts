import { ActivityOptions, ActivityType, ColorResolvable } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const discordToken = process.env.DISCORD_TOKEN;
const modulesDir = path.join(ROOT, "/modules/");
const binariesDir = path.join(ROOT, "/../bin/");
const activityStatus: ActivityOptions = { type: ActivityType.Watching, name: "over you" };
const colors = {
    default: "#ff6e9b" as ColorResolvable,
    error: "#b94e59" as ColorResolvable,
    warning: "#e5925f" as ColorResolvable,
    info: "#367df6" as ColorResolvable,
    success: "#83d18e" as ColorResolvable
};

const config = {
    discordToken,
    modulesDir,
    binariesDir,
    activityStatus,
    colors
};

export default config;

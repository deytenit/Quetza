import { ActivityOptions, ActivityType, ColorResolvable } from "discord.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/** Quetza project root directory. */
const rootDir = dirname(fileURLToPath(import.meta.url));
/** Quetza's modules directory. */
const modulesDir = join(rootDir, "/modules/");
/** External binaries directory. */
const binariesDir = join(rootDir, "/bin/");
/** Logger files directory. */
const loggerDir = join(rootDir, "/log/");

/** Locations that might be useful in application. */
const path = {
    root: rootDir,
    modules: modulesDir,
    binaries: binariesDir,
    log: loggerDir
};

/** Discord bot token. */
const appToken = process.env.DISCORD_TOKEN;
/** Discord bot user activity status */
const appActivity = { type: ActivityType.Watching, name: "over you" };

/** Bot application configuration variables. */
const application = {
    token: appToken,
    activity: appActivity as ActivityOptions
};

/** Colors Quetza uses in responses. */
const colors = {
    default: "#ff6e9b" as ColorResolvable,
    error: "#b94e59" as ColorResolvable,
    warning: "#e5925f" as ColorResolvable,
    info: "#367df6" as ColorResolvable,
    success: "#83d18e" as ColorResolvable
};

/** Guild where testing occures. */
const testGuild = "912401672939139142";

/** Developing options. */
const dev = {
    guild: testGuild
};

/** Exported bundled configuration object. */
const config = {
    application,
    colors,
    path,
    dev
};

export default config;

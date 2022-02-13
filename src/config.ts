/**
 * Bot configuration file.
 * @field opId Contains bot author Discord ID for moderating on go.
 * @field token Discord API token.
 * @field color Bot color theme for Embeds.
 * @field rootDir Directory that goes before commands and events.
 * @field commands Directories for bot's modules.
 */
const quetzaConfig = {
    opId: "214422162906415106",
    token: process.env.DISCORD_TOKEN || "NzgzNDQwMjU3NjE3MzYyOTQ1.X8axmQ.vgeSfJHz_PVDbi3eHu7hTlbuCoo",
    color: "#C4A4BE",
    rootDir: __dirname + "/",
    modules: [
        "quetza/",
        "music/"
    ]
}

export {quetzaConfig}

import path from "path";

const config = {
    token: process.env.DISCORD_TOKEN,
    commands: path.join(__dirname, "/commands/"),
    events: path.join(__dirname, "/events/"),
    binaries: path.join(__dirname, "/../bin/")
};

export default config;

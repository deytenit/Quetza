"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
async function run(client, ctx) {
    const pos = ctx.options.getString("position");
    const query = ctx.options.getString("query");
    if (ctx.guildId === null || query === null)
        return;
    let player = client.players.getPlayer(ctx.guildId);
    if (!player)
        return;
    let state;
    if (!isNaN(Number(query))) {
        await player.addTrack(query, ctx.user, Number(query) - 1);
    }
    const embed = new discord_js_1.MessageEmbed()
        .setColor(config_1.design.color)
        .setTitle("Inserted.");
    try {
        await ctx.reply({ embeds: [embed] });
    }
    catch { }
}
exports.run = run;
const data = {
    name: "insert",
    description: "Insert new track to specific position.",
    options: [
        {
            name: "query",
            description: "Title or URL of the song.",
            type: "STRING",
            required: true
        },
        {
            name: "position",
            description: "Position to insert.",
            type: "STRING",
            required: true
        }
    ]
};
exports.data = data;
//# sourceMappingURL=insert.js.map
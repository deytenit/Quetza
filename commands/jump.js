"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
async function run(client, ctx) {
    const query = ctx.options.getString("position");
    if (ctx.guildId === null || query === null)
        return;
    let player = client.players.getPlayer(ctx.guildId);
    if (!player)
        return;
    let state;
    if (!isNaN(Number(query))) {
        state = await player.jump(Number(query) - 1);
    }
    else {
        state = await player.jump(query);
    }
    if (state) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor(config_1.design.color)
            .setTitle("Jumped.");
        try {
            await ctx.reply({ embeds: [embed] });
        }
        catch { }
    }
}
exports.run = run;
const data = {
    name: "jump",
    description: "Jump to specific track in queue.",
    options: [
        {
            name: "position",
            description: "Position to jump to.",
            type: "STRING",
            required: true
        }
    ]
};
exports.data = data;
//# sourceMappingURL=jump.js.map
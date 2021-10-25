"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
async function run(client, ctx) {
    if (ctx.guildId === null)
        return;
    const player = client.players.getPlayer(ctx.guildId);
    if (player)
        player.skip();
    const embed = new discord_js_1.MessageEmbed()
        .setColor(config_1.design.color)
        .setTitle("Skipped.");
    try {
        await ctx.reply({ embeds: [embed] });
    }
    catch { }
}
exports.run = run;
const data = {
    name: "next",
    description: "Skip current song."
};
exports.data = data;
//# sourceMappingURL=next.js.map
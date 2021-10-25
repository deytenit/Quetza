"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
async function run(client, ctx) {
    if (ctx.guildId === null)
        return;
    const player = client.players.getPlayer(ctx.guildId);
    if (player) {
        player.clear();
        const embed = new discord_js_1.MessageEmbed()
            .setColor(config_1.design.color)
            .setTitle("Queue has been cleared.");
        try {
            await ctx.reply({ embeds: [embed] });
        }
        catch { }
    }
}
exports.run = run;
const data = {
    name: "clear",
    description: "Clears queue.",
};
exports.data = data;
//# sourceMappingURL=clear.js.map
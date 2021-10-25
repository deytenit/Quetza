"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
async function run(client, ctx) {
    if (ctx.guildId === null)
        return;
    let player = client.players.getPlayer(ctx.guildId);
    if (!player)
        player = client.players.genPlayer(ctx.guildId);
    if (!player.connection) {
        const channel = ctx.member.voice.channel;
        if (channel) {
            await player.connect(channel);
            const embed = new discord_js_1.MessageEmbed()
                .setColor(config_1.design.color)
                .setTitle(`Successfully connected to ${channel.name}.`);
            try {
                await ctx.reply({ embeds: [embed] });
            }
            catch { }
        }
        else {
            client.players.delPlayer(ctx.guildId);
            const embed = new discord_js_1.MessageEmbed()
                .setColor(config_1.design.color)
                .setTitle("Please connect to a voice channel.");
            try {
                await ctx.reply({ embeds: [embed] });
            }
            catch { }
        }
    }
}
exports.run = run;
const data = {
    name: "connect",
    description: "Connect to voice channel."
};
exports.data = data;
//# sourceMappingURL=connect.js.map
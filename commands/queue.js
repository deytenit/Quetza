"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
const Misc_1 = require("../types/Misc");
async function run(client, ctx) {
    if (ctx.guildId === null)
        return;
    const player = client.players.getPlayer(ctx.guildId);
    if (player) {
        const queue = player.queue;
        if (queue.length === 0) {
            const embed = new discord_js_1.MessageEmbed()
                .setColor(config_1.design.color)
                .setTitle("Queue is empty.");
            try {
                await ctx.reply({ embeds: [embed] });
            }
            catch { }
        }
        else {
            let page = 0;
            const maxPage = Math.floor(queue.length / 11);
            const row = new discord_js_1.MessageActionRow()
                .addComponents(new discord_js_1.MessageButton()
                .setCustomId("QueueTop")
                .setLabel("TOP")
                .setStyle("SECONDARY"), new discord_js_1.MessageButton()
                .setCustomId("QueueUp")
                .setLabel("UP")
                .setStyle("SECONDARY"), new discord_js_1.MessageButton()
                .setCustomId("QueueDown")
                .setLabel("DOWN")
                .setStyle("SECONDARY"), new discord_js_1.MessageButton()
                .setCustomId("QueueEnd")
                .setLabel("END")
                .setStyle("SECONDARY"));
            await ctx.reply({
                content: (0, Misc_1.generateQueue)(queue, page, player.queuePosition),
                components: [row]
            });
            const filter = (btn) => btn.message === ctx.fetchReply();
            const collector = ctx.channel.createMessageComponentCollector({ filter, time: 15000 });
            collector.on("collect", async (btn) => {
                switch (btn.customId) {
                    case "QueueTop": page = 0;
                    case "QueueUp": page = Math.max(page - 1, 0);
                    case "QueueDown": page = Math.min(page + 1, maxPage);
                    case "QueueEnd": page = maxPage;
                }
                await btn.update({
                    content: (0, Misc_1.generateQueue)(queue, page, player.queuePosition)
                });
            });
        }
    }
}
exports.run = run;
const data = {
    name: "queue",
    description: "Send player queue.",
};
exports.data = data;
//# sourceMappingURL=queue.js.map
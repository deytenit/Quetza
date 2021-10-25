"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const config_1 = require("../config");
const discord_js_1 = require("discord.js");
async function run(client, ctx) {
    const query = ctx.options.getString("query");
    if (ctx.guildId === null || query === null)
        return;
    let player = client.players.getPlayer(ctx.guildId);
    if (!player)
        player = client.players.genPlayer(ctx.guildId);
    if (!player.connection) {
        const channel = ctx.member.voice.channel;
        if (channel) {
            await player.connect(channel);
        }
        else {
            client.players.delPlayer(ctx.guildId);
            await ctx.reply("Please connect to a voice chat.");
            return;
        }
    }
    const track = await player.addTrack(query, ctx.user);
    if (!player.nowPlaying) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor(config_1.design.color)
            .setTitle("Preparing player.");
        player.setMessage(await ctx.channel.send({ embeds: [embed] }));
        await player.play();
    }
    const embed = new discord_js_1.MessageEmbed()
        .setColor(config_1.design.color)
        .setTitle(track.title)
        .setDescription("Has been pushed to queue.")
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .setAuthor(`@${ctx.user.tag}`, ctx.user.avatarURL());
    try {
        await ctx.reply({ embeds: [embed] });
    }
    catch { }
    console.log(`${track.title} added to ${ctx.guildId}`);
}
exports.run = run;
const data = {
    name: "play",
    description: "Play a song or add it to queue.",
    options: [
        {
            name: "query",
            description: "Title or URL of the song.",
            type: "STRING",
            required: true
        }
    ]
};
exports.data = data;
//# sourceMappingURL=play.js.map
import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";

import { QuetzaClient } from "../../../assets/QuetzaClient";
import { Music } from "../assets/QuetzaMusic/Music";

import fetch from "node-fetch";


const dividers = [
    `</div></div></div></div><div class="hwc"><div class="BNeawe tAd8D AP7Wnd"><div><div class="BNeawe tAd8D AP7Wnd">`,
    `</div></div></div></div></div><div><span class="hwc"><div class="BNeawe uEec3 AP7Wnd">`
]


export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = (client.Modules["music"].control as Music).getPlayer(ctx.guild.id);

    if (!player || !player.NowPlaying)
        return;

    await ctx.deferReply();

    const embed = new MessageEmbed()
        .setColor(quetzaConfig.color as ColorResolvable)
        .setTitle(player.NowPlaying.metadata.title)
        .setDescription("Lyrics powered by Google and their partners.");

    const response = await fetch(`https://www.google.com/search?q=${player.NowPlaying.metadata.title.replace(" ", "+").replace(/ *\[[^)]*\] */g, "") + "+Lyrics"}`)
    const data = await response.text();

    if (!data.includes(dividers[0])) {
        embed.setTitle("Could not find lyrics for that one.");
        ctx.editReply({ embeds: [embed] });
        return;
    }

    
    await ctx.editReply({ content: `\`\`\`\n${data.split(dividers[0])[1].split(dividers[1])[0]}\`\`\``, embeds: [embed]});
}

const data = {
    name: "lyrics",
    description: "Get lyrics for current song.",
}

export { data }
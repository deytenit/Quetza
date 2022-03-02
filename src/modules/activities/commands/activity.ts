
import { quetzaConfig } from "../../../config";
import { QuetzaClient } from "../../../assets/QuetzaClient";

import {
    ColorResolvable, CommandInteraction, GuildMember,
    MessageEmbed, TextChannel
} from "discord.js";

import activityInvite from "../assets/Activities";


export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const activity = ctx.options.getString("activity")

    if (ctx.guild === null || !activity)
        return;

    const channel = (ctx.member as GuildMember).voice.channel;

    if (!channel) {
        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle("Connect to a voice channel first.");
        await ctx.reply({ embeds: [embed] });

        return;
    }

    const invite = await activityInvite(client, channel.id, activity);

    if (invite) {
        await ctx.reply("https://discord.com/invite/"+invite.code);
        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`Click me to start "${activity}" activity.`)
            .setURL("https://discord.com/invite/"+invite.code);
        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "activity",
    description: "Start or join a voice channel activity.",
    options: [
        {
            name: "activity",
            description: "Select an activity to start.",
            type: "STRING",
            required: true,
            choices: [
                { name: "Youtube together", value: "youtube_together" },
                { name: "Fishington", value: "fishington" },
                { name: "Word snacks", value: "wordsnacks" },
                { name: "Betrayal", value: "betrayal" },
                { name: "Lettertile", value: "lettertile" }
            ]
        }
    ]
}

export { data }
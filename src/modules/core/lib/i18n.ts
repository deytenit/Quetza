import { EmbedBuilder, InteractionReplyOptions } from "discord.js";

import { Module } from "../../../lib/types.js";
export default class I18n {
    public static readonly replies = {
        modules: (modules: Module[]): InteractionReplyOptions => {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Modules")
                .addFields(
                    modules.map((value) => {
                        return {
                            name: value.name + "@" + value.tag,
                            value: (value.description ?? "") + " | " + value.author,
                            inline: true
                        };
                    })
                );

            return { embeds: [embed] };
        },
        ping: (ping?: number): InteractionReplyOptions => {
            const title = ping ? `I have pinged ${ping} ms late.` : "There is no application.";

            const comment = !ping
                ? "How am I speaking then?"
                : ping > 250
                ? "I'm kinda slowpoke ngl."
                : ping > 200
                ? "I can do better than this."
                : "Dream's speed!";

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(`**${title}**`)
                .setDescription(`_**${comment}**_`);

            return { embeds: [embed] };
        }
    };
}

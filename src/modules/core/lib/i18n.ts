import { bold, Collection, EmbedBuilder, InteractionReplyOptions, italic } from "discord.js";

import { ModuleMetadata } from "../../../lib/types.js";
export default class I18n {
    public static readonly replies = {
        modules: (modules: Collection<string, ModuleMetadata>): InteractionReplyOptions => {
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
                .setTitle(bold(title))
                .setDescription(italic(bold(comment)));

            return { embeds: [embed] };
        }
    };
}

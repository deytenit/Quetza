import { bold, Collection, EmbedBuilder, InteractionReplyOptions, italic } from "discord.js";

import { ModuleMetadata } from "../../../lib/types.js";

const replies = {
    modules: (modules: Collection<string, ModuleMetadata>): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Modules")
            .addFields(
                modules.map((value) => {
                    return {
                        name: value.name + "@" + value.tag,
                        value: italic((value.description ?? "") + " | " + value.author),
                        inline: true
                    };
                })
            );

        return { embeds: [embed] };
    },
    ping: (websocket: number, roundtrip?: number): InteractionReplyOptions => {
        const title = roundtrip ? `I've pinged ${roundtrip} ms. late` : "Pinging...";

        const comment = `Websocket ping is ${websocket} ms.`;

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(bold(title))
            .setDescription(italic(bold(comment)));

        return { embeds: [embed] };
    }
};

export default replies;

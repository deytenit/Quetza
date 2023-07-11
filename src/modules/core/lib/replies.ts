import { BaseMessageOptions, Collection, EmbedBuilder, italic } from "discord.js";

import config from "../../../config.js";
import { ModuleMetadata } from "../../../lib/types.js";

const replies = {
    modules: (modules: Collection<string, ModuleMetadata>): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle("Applied modules")
            .addFields(
                modules.map((value) => {
                    return {
                        name: value.name + "@" + value.tag,
                        value: italic(value.description ?? "")
                    };
                })
            );

        return { embeds: [embed] };
    },
    ping: (websocket: number, roundtrip?: number): BaseMessageOptions => {
        const title = roundtrip ? `I've pinged ${roundtrip} ms. late` : "Pinging...";

        const comment = `Websocket ping is ${websocket} ms.`;

        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle(title)
            .setDescription(italic(comment));

        return { embeds: [embed] };
    }
};

export default replies;

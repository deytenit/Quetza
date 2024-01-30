import { BaseMessageOptions, Collection, EmbedBuilder, italic } from "discord.js";

import config from "$config.js";
import { Module } from "$lib/types.js";

const replies = {
    modules: (modules: Collection<string, Module>): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle("Avaliable modules")
            .addFields(
                modules.map((value) => ({
                    name: value.name,
                    value: italic(value.description ?? "")
                }))
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

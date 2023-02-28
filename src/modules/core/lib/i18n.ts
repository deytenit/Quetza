import { EmbedBuilder } from "discord.js";

import { Module } from "../../../lib/types";

const i18n = {
    modules: (modules: Module[]) => {
        return new EmbedBuilder()
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
    },
    ping: (ping?: number) => {
        const title = ping ? `I have pinged ${ping} ms late.` : "There is no application.";

        const comment = !ping
            ? "How am I speaking then?"
            : ping > 250
            ? "I'm kinda slowpoke ngl."
            : ping > 200
            ? "I can do better than this."
            : "Dream's speed!";

        return new EmbedBuilder()
            .setColor("Random")
            .setTitle(`**${title}**`)
            .setDescription(`_**${comment}**_`);
    }
};

export default i18n;

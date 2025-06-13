import { BaseMessageOptions, EmbedBuilder, italic } from "discord.js";

import config from "$config.js";

const replies = {
    response: (content: string): BaseMessageOptions => {
        return { content };
    },

    error: (
        message: string = "Sorry, I encountered an error processing your request."
    ): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.error || "#ff0000")
            .setTitle("⚠️ Error")
            .setDescription(italic(message));

        return { embeds: [embed] };
    },

    connectionError: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.warning || "#ffaa00")
            .setTitle("🔌 Connection Issue")
            .setDescription(
                italic("Unable to connect to the LLAMA service. Please try again later.")
            );

        return { embeds: [embed] };
    },

    historyCleared: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.success || "#00ff00")
            .setTitle("🧹 History Cleared")
            .setDescription(italic("Your conversation history has been cleared."));

        return { embeds: [embed] };
    }
};

export default replies;

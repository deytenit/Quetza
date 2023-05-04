import {
    bold,
    Collection,
    EmbedBuilder,
    InteractionReplyOptions,
    italic,
    Role,
    User
} from "discord.js";

const replies = {
    action: (action: string, user: User, reason?: string): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(bold(`${user.tag} was ${action}`))
            .setDescription(italic(reason ?? "No reason provided."))
            .setTimestamp();

        return { embeds: [embed] };
    },
    notMember: (action: string, user: User): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(bold(`${user.tag} cannot be ${action}`))
            .setDescription(italic("They're not a guild member."))
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    roleAction: (
        action: string,
        user: User,
        roleName: string,
        reason?: string
    ): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(bold(`Role ${roleName} was ${action} user ${user.tag}`))
            .setDescription(italic(reason ?? "No reason provided."))
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    roleList: (user: User, roles: Collection<string, Role>): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(bold(`${user.tag} roles:`))
            .addFields(
                roles.map((role) => {
                    return {
                        name: role.name,
                        value: italic(role.id),
                        inline: true
                    };
                })
            )
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    auto: (action: string, event: string): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(bold(`Now I will ${italic(action)} when ${italic(event)} event happens`))
            .setTimestamp();

        return { embeds: [embed] };
    }
};

export default replies;

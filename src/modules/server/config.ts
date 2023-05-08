import { Events } from "discord.js";

const config = {
    autoEventChoices: [
        {
            name: "Message Create",
            value: Events.MessageCreate,
        },
        {
            name: "Member Joins",
            value: Events.GuildMemberAdd
        }
    ]
};

export default config;

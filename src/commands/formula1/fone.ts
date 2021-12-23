import { design } from "../../config";
import { getConstructors, getSchedule } from "../../assets/FormulaApi/d";

import {
    ColorResolvable, CommandInteraction, GuildMember,
    MessageEmbed, TextChannel
} from "discord.js";
import { MyClient } from "../../assets/MyClient";

function tableGenerator(data: any): MessageEmbed {
    let response = new MessageEmbed()
    .setColor(design.color as ColorResolvable)
    .setTitle(`${data.season} FIA Formula 1 World Championship Schedule`)
    .setURL(`https://www.formula1.com/en/racing/${data.season}.html`);
    data.Races.forEach((event: any) => {
        response.addField(
            `${event.round}. ${event.raceName}`,
            `${event.Circuit.circuitName} ${event.date}`,
            false
        );
    });
    return response;
}

export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    await ctx.deferReply();

    getSchedule("current", (data) => {
        ctx.editReply({ embeds: [tableGenerator(data)] })
    });
}

const data = {
    "name": "fone",
    "description": "Print out formula 1 race schedule."
}

export { data }
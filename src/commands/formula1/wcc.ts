import { design } from "../../config";
import { getConstructors } from "../../assets/FormulaApi/d";

import {
    ColorResolvable, CommandInteraction, GuildMember,
    MessageEmbed, TextChannel
} from "discord.js";
import { MyClient } from "../../assets/MyClient";

function tableGenerator(data: any): MessageEmbed {
    let response = new MessageEmbed()
    .setColor(design.color as ColorResolvable)
    .setTitle(`${data.season} FIA Formula 1 World Constructors Championship Standings`)
    .setDescription(`on round ${data.round}`)
    .setURL(`https://en.wikipedia.org/wiki/${data.season}_Formula_One_season`);
    data.ConstructorStandings.forEach((constructor: any) => {
        response.addField(
            `${constructor.position}. ${constructor.Constructor.name}`,
            `${constructor.Constructor.nationality} ${constructor.points} points`,
            true
        );
    });
    return response;
}

export async function run(client: MyClient, ctx: CommandInteraction) {
    let year = ctx.options.getInteger("year");
    if (ctx.guild === null)
        return;

    await ctx.deferReply();

    if (!year || year > new Date().getFullYear() - 1 || year < 1950)
        getConstructors("current", (data) => {
            ctx.editReply({ embeds: [tableGenerator(data)] })
        });
    else
        getConstructors(year.toString(), (data) => {
            ctx.editReply({ embeds: [tableGenerator(data)] })
        });
}

const data = {
    "name": "wcc",
    "description": "Print out world constructor championship standings.",
    options: [
        {
            name: "year",
            description: "Year to print.",
            type: "INTEGER",
            required: false
        }
    ]
}

export { data }
import { design } from "../../config";
import { getDrivers } from "../../assets/FormulaApi/Formula";

import {
    ColorResolvable, CommandInteraction, GuildMember,
    MessageEmbed, TextChannel
} from "discord.js";
import { MyClient } from "../../assets/MyClient";

function tableGenerator(data: any): MessageEmbed {
    let response = new MessageEmbed()
    .setColor(design.color as ColorResolvable)
    .setTitle(`${data.season} FIA Formula 1 World Drivers Championship Standings`)
    .setDescription(`on round ${data.round}`)
    .setURL(`https://en.wikipedia.org/wiki/${data.season}_Formula_One_season`);
    data.DriverStandings.forEach((driver: any) => {
        response.addField(
            `${driver.position}. ${driver.Driver.givenName} ${driver.Driver.familyName}`,
            `${driver.Constructors[0].name} ${driver.points} points`,
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
        getDrivers("current", (data) => {
            ctx.editReply({ embeds: [tableGenerator(data)] })
        });
    else
        getDrivers(year.toString(), (data) => {
            ctx.editReply({ embeds: [tableGenerator(data)] })
        });
}

const data = {
    "name": "wdc",
    "description": "Print out world driver championship standings.",
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
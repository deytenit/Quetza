"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
async function run(client, ctx) {
    const time = ctx.options.getInteger("time");
    if (ctx.guildId === null || time === null)
        return;
    let player = client.players.getPlayer(ctx.guildId);
    if (player)
        await player.seek(time);
}
exports.run = run;
const data = {
    name: "seek",
    description: "Fastforward to timecode.",
    options: [
        {
            name: "time",
            description: "Timecode to seek.",
            type: "INTEGER",
            required: true
        }
    ]
};
exports.data = data;
//# sourceMappingURL=seek.js.map
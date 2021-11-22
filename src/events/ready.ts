import { MyClient } from "../assets/MyClient";

export async function run(args: unknown[], client: MyClient): Promise<void> {
    if (!client.user)
        return;

    console.log("LOADING - booting system...\n");
    console.log("Commencing System Check");
    console.log("Memory Unit: Green");
    console.log("Loading Geographic Data");
    console.log("Vitals: Green");
    console.log("Remaining MP: 100%");
    console.log("Black Box Temperature: Normal");
    console.log("Black Box Internal Pressure: Normal");
    console.log("Activating IFF");
    console.log("Activating FCS");
    console.log("Initializing Pod Connection");
    console.log("Launching DBU Setup");
    console.log("Activating Interia Control System");
    console.log("Activating Authentication: Complete");
    console.log("Equipment Status: Green");
    console.log("All Systems Green");
    console.log("Combat Preperation Complete");


    console.log(`${client.user.username} logged in as ${client.user.tag}!`);
    client.user.setActivity("on sound waves.", { type: "PLAYING" });
}


export const name = "ready";
import { Client, Invite } from "discord.js";
import fetch from "node-fetch";

const applications: Record<string, string> = {
    "youtube_together": "880218394199220334",
    "watch_together_dev": "880218832743055411",
    "fishington": "814288819477020702",
    "chess_in_the_park": "832012774040141894",
    "chess_in_the_park_dev": "832012586023256104",
    "betrayal": "773336526917861400",
    "doodlecrew": "878067389634314250",
    "wordsnacks": "879863976006127627",
    "lettertile": "879863686565621790",
    "poker_night": "755827207812677713"
}


export default async function activityInvite(client: Client, channelId: string, application: string): Promise<Invite | undefined> {
    try {
        return await fetch(`https://discord.com/api/v8/channels/${channelId}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: applications[application]?applications[application]:application,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        }).then(response => response.json());
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}


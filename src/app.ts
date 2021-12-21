"use strict";

import { MyClient } from "./assets/MyClient";

const token = process.env.DISCORD_TOKEN || "NzgzNDQwMjU3NjE3MzYyOTQ1.X8axmQ.7SbjdCVkS4LhgqN1umsvx5ig7NM";

const client = new MyClient("./commands", "./events", "214422162906415106");

client.login(token);
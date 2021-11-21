"use strict";

import { MyClient } from "./types/Client";

const token = process.env.DISCORD_TOKEN;

const client = new MyClient("./commands", "./events");

client.login(token);
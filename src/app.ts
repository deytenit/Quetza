"use strict";

import { MyClient } from "./assets/MyClient";

const token = process.env.DISCORD_TOKEN;

const client = new MyClient("./dist/commands", "./dist/events", "214422162906415106");

client.login(token);
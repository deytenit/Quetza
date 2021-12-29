"use strict";

import { MyClient } from "./assets/MyClient";

const token = process.env.DISCORD_TOKEN || "NzgzNDQwMjU3NjE3MzYyOTQ1.X8axmQ.H0lOGrs0BIdWJFR1Fcw4t4HWnT0";

const client = new MyClient("commands", "events", "214422162906415106");

client.login(token);
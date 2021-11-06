"use strict";

import { MyClient } from "./types/Client";

const token = "NzIyMjE0MTA3MjM5MDIyNjcy.Xuf0TQ.9uJbIhlTUDCsKnt0_UcuHOG7i94";

const client = new MyClient("./commands", "./events");

client.login(token);
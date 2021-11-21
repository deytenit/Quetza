"use strict";

import { MyClient } from "./types/MyClient";

const token = "NzIyMjE0MTA3MjM5MDIyNjcy.Xuf0TQ.tQQ574UOJ3QGJ_YHDCYJck9HjtQ";

const client = new MyClient("./commands", "./events", "214422162906415106");

client.login(token);
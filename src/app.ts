"use strict";

import { QuetzaClient } from "./assets/QuetzaClient";
import { quetzaConfig } from "./config";

const client = new QuetzaClient();

client.login(quetzaConfig.token);
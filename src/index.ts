import config from "./config.js";
import Client from "./lib/client.js";

const client = new Client();

client.login(config.token);

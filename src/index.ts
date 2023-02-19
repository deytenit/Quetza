import Client from "./lib/Client.js";
import config from "./config.js";

const client = new Client();

client.login(config.token);

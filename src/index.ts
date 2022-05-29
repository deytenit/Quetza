import Client from "./lib/Client";
import config from "./config";

const client = new Client();

client.login(config.token);

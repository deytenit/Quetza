/**
 * Music module definition.
 *
 * Module to play media content from various sites.
 * @see ./lib/fetch/extractors.ts for site extractors.
 *
 * @packageDocumentation
 */
import Music from "./lib/music.js";

const name = "music";
const description = "Music module";

const controller = new Music();

export { controller, description, name };

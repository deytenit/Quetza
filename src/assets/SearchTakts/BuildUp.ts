import { exec } from "child_process"
import { promisify } from "util";

const execAsync = promisify(exec);

export async function buildUp(): Promise<void> {
    await execAsync("mkdir -p foo $1/dist/assets/SearchTakts/bin");
    await execAsync("curl -L https://yt-dl.org/downloads/latest/youtube-dl -o $1/dist/assets/SearchTakts/bin/youtube-dl");
    await execAsync("chmod a+rx $1/dist/assets/SearchTakts/bin/youtube-dl");
    await execAsync("PATH=$PATH:$1/bin/");
}
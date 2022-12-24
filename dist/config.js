import fs from 'fs';
// Todo: check sanity of config items
export function getConfig(configFile) {
    return JSON.parse(fs.readFileSync(configFile, "utf8"));
}

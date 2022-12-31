import fs from 'fs';
export var models;
(function (models) {
    models["SPH3000"] = "SPH3000";
    models["Other"] = "Other";
})(models || (models = {}));
// Todo: check sanity of config items
export function getConfig(configFile) {
    return JSON.parse(fs.readFileSync(configFile, "utf8"));
}

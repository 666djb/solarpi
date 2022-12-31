import fs from 'fs';
var models;
(function (models) {
    models[models["SPH3000"] = 0] = "SPH3000";
    models[models["Other"] = 1] = "Other";
})(models || (models = {}));
// Todo: check sanity of config items
export function getConfig(configFile) {
    return JSON.parse(fs.readFileSync(configFile, "utf8"));
}

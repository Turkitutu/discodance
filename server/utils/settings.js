const fs = require("fs");

const Settings = function(path) {
	if (path in [undefined, "", false, true, null])
		throw new Error("Argument one should be string.");
	this.path = path;
	if (!fs.existsSync(this.path))
		throw new Error("File is not exists anymore.");
	this.data = JSON.parse(fs.readFileSync(path, "utf-8"));
}
Settings.prototype.updateFile = function(data) {
	if (typeof data !== "object")
		throw new Error("Data should be in JSON object.");
	fs.writeFileSync(this.path, JSON.stringify(data));
	this.data = data;
}
module.exports = Settings;
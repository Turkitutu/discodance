const fs = require("fs"),
      path = require("path");

class Settings {
    constructor(filepath) {
        this.filepath = path.resolve(__dirname, '..', filepath);
        Object.assign(this, JSON.parse(fs.readFileSync(this.filepath, "utf-8")));
    }
    updateFile(data) {
        fs.writeFile(this.filepath, JSON.stringify(data));
        Object.assign(this, data);
    }
}

module.exports = Settings;
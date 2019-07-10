const path = require('path');

module.exports = {
    mode: "development",
    entry: "./client/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "public")
    }
}
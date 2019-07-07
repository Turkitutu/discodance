const path = require('path');

module.exports = {
    mode: "production",
    entry: "./client/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "public")
    }
}
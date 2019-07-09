const path = require('path');

module.exports = {
    mode: 'production',
//bc2e830a550b903fdc4da7d0721eafa8a5045d4b
    entry: "./client/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "public")
    }
}
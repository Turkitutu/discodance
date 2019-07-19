const path = require('path');
require('dotenv').config();

module.exports = {
    mode: "development",
    entry: "./client/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, process.env.WEBSITE_REPO_PATH, 'public')
    }
}
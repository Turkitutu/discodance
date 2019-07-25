const webpack = require('webpack'),
      path = require('path'),
      fs = require('fs'),
      TerserPlugin = require('terser-webpack-plugin'),
      Terser = require("terser");
      babel = require("@babel/core");

require('dotenv').config();

var reserved = [];
var filtered = ['name'];

function add(name) {
    reserved.push(name);
}

[ 
    Object, Array, Function,
    String, Math, Date

].forEach(function(ctor) {
    Object.getOwnPropertyNames(ctor).map(add);
    if (ctor.prototype) {
        Object.getOwnPropertyNames(ctor.prototype).map(add);
    }
});

reserved = reserved.filter((name, i) => filtered.indexOf(name) === -1 && reserved.indexOf(name) === i && !name.startsWith('$'));

reserved.forEach(x => console.log(x));

var config = {
    mode: "production",
    entry: "./client/main.js",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, process.env.WEBSITE_REPO_PATH, 'public')
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 8,
                    mangle: {
                        reserved: [],
                        toplevel: true,
                        properties: {
                            builtins: true,
                            reserved: reserved,
                            debug: ""
                        }
                    }
                }
            })
        ]
    }
};

var babelOptions = {
    presets: ["@babel/preset-env"]
}

var compiler = webpack(config);

compiler.run(function (err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true
    }) + '\n\nTranspiling with Babel...\n\n');
    const filename = path.resolve(config.output.path, 'main.js');
    fs.readFile(filename, (err, data) => {
        if (err) throw err;
        babel.transform(data, babelOptions, (err, results) => {
            if (err) throw err;
            fs.writeFile(filename, Terser.minify(results.code, {toplevel:true}).code, err => {
                if (err) throw err;
                process.stdout.write('Success!\n\n');
            });
        });
    });
});
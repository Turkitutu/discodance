const webpack = require('webpack'),
      path = require('path'),
      fs = require('fs'),
      TerserPlugin = require('terser-webpack-plugin'),
      Terser = require("terser");
      babel = require("@babel/core");

require('dotenv').config();

var reserved = ['exports', 'enumerable', 'key', 'value'];

function add(name) {
    reserved.push(name);
}
// Compatibility fix for some standard defined globals not defined on every js environment
var new_globals = ["Symbol", "Map", "Promise", "Proxy", "Reflect", "Set", "WeakMap", "WeakSet"];
var objects = {};
var global_ref = typeof global === "object" ? global : self;

new_globals.forEach(function (new_global) {
    objects[new_global] = global_ref[new_global] || new Function();
});

[
    "null",
    "true",
    "false",
    "Infinity",
    "-Infinity",
    "undefined",
].forEach(add);

[ Object, Array, Function, Number,
  String, Boolean, Error, Math,
  Date, RegExp, objects.Symbol, ArrayBuffer,
  DataView, decodeURI, decodeURIComponent,
  encodeURI, encodeURIComponent, eval, EvalError,
  Float32Array, Float64Array, Int8Array, Int16Array,
  Int32Array, isFinite, isNaN, JSON, objects.Map, parseFloat,
  parseInt, objects.Promise, objects.Proxy, RangeError, ReferenceError,
  objects.Reflect, objects.Set, SyntaxError, TypeError, Uint8Array,
  Uint8ClampedArray, Uint16Array, Uint32Array, URIError,
  objects.WeakMap, objects.WeakSet
].forEach(function(ctor) {
    Object.getOwnPropertyNames(ctor).map(add);
    if (ctor.prototype) {
        Object.getOwnPropertyNames(ctor.prototype).map(add);
    }
});


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
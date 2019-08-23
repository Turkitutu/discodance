const webpack = require('webpack'),
      path = require('path'),
      fs = require('fs'),
      TerserPlugin = require('terser-webpack-plugin'),
      Terser = require("terser"),
      babel = require("@babel/core");

require('dotenv').config();

var mustInclude = ['Ticker', 'ObservablePoint', 'Loader', 'BaseFactory', 'Animation', 'b2Rot', 'b2World', 'GUISprite']; 

var reserved = []; //property names that must not be changed during the minifying process;
var filtered = ['name', 'set'];

function add(name) {
    reserved.push(name);
}

[ 
    Object, Array, Function,
    String, Math, Date, 
    ArrayBuffer, Uint8Array.__proto__.prototype

].forEach(function(ctor) {
    Object.getOwnPropertyNames(ctor).map(add);
    if (ctor.prototype) {
        Object.getOwnPropertyNames(ctor.prototype).map(add);
    }
});

reserved = reserved.filter((name, i) => filtered.indexOf(name) === -1 && reserved.indexOf(name) === i && !name.startsWith('$'));

//reserved.forEach(x => console.log(x));

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
                    compress: {
                        properties: false
                    },
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
    },
    node: false
};

var walkSync = function(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist);
        } else {
            filelist.push(dir + file);
        }
    });
    return filelist;
};

function generate() {
    const filelist = walkSync('./client/');
    const loaded = {};
    const check = f => {
        for (let file of filelist) {
            file = loaded[file] || (loaded[file]=fs.readFileSync(file));
            if (mustInclude.includes(f) || file.includes(f)) return true;
        }
    }
    const toProperty = name => name.replace(/^\$/,'').match(/^[$_a-zA-Z][$\w]*$/) ? '.'+name : '['+JSON.stringify(name)+']';
    const stringify = (str, obj) => {
        if (!obj) return;
        for (const child of obj) {
            if (check(child.name)) {
                str.push(
                    child.descriptor
                    ? `Object.defineProperty(${child.parentName}, ${JSON.stringify(child.name)}, Object.getOwnPropertyDescriptor(${child.parentName}, ${JSON.stringify(child.name)}));`
                    : `${child.parentName}${toProperty(child.name)} = ${child.parentName}${toProperty('$'+child.name)};`
                );
                stringify(str, child.children);
            }
        } 
    }
    const refs = walkSync('./libs/').filter(name => name.match(/\.json/));
    for (const filename of refs) {
        const lib = JSON.parse(fs.readFileSync(filename));
        let str = [`const ${lib.name} = ${lib.parentName};`];
        stringify(str, lib.children);
        str.push(`module.exports = ${lib.name};`);
        fs.writeFileSync(filename.replace('.json', '.js'), str.join('\n'));
    }
}

if (process.argv.includes('--generate', 2)) {
    generate();
}

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
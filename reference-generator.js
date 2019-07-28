var library = PIXI,
    libraryName = 'PIXI',
    newName = 'Pixi';




/* 
  DON'T TOUCH THE CODE BELOW
*/

var reserved = ['constructor'];
var filtered = ['prototype'];

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

function isProperty(descriptor) {
    return !descriptor || (!descriptor.get && !descriptor.set);
}
function toProperty(name) {
    return name.replace(/^\$/,'').match(/^[$_a-zA-Z][$\w]*$/) ? '.'+name : '['+JSON.stringify(name)+']';
}

function loop(name, obj, done) {
    done.push(obj);
    let children = [];
    for (const prop of Object.getOwnPropertyNames(obj)) {
        if (reserved.indexOf(prop) !== -1) continue;
        if (prop == 'prototype') {
            if (done.indexOf(obj[prop]) === -1) {
                children = children.concat(loop(name+'.prototype', obj[prop], done));
            }
            continue;
        }
        const desc = Object.getOwnPropertyDescriptor(obj, prop);
        children.push({
            name: prop,
            parentName: name,
            descriptor: !isProperty(desc),
            children: (()=>{
                let child;
                try {
                    child = obj[prop];
                } catch (e) {}
                return (child && obj[prop] && done.indexOf(obj[prop])===-1 && (typeof obj[prop] == 'object' || typeof obj[prop] == 'function'))
                        ? loop(name+toProperty(prop), obj[prop], done)
                        : [];
            })()
        });
    }
    return children;
}

function generate(name, obj, objName) {
    let json = {
        name: name,
        parentName: objName,
        descriptor: false,
        children: loop(name, obj, [])
    };
    return JSON.stringify(json);
}

document.body.innerHTML = generate(newName, library, libraryName);
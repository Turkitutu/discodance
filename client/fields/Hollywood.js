const PhysicObject = require('../physics/object');

const assets = [

]

function create(field, resources) {
    field.addObject(new PhysicObject({
        shape: 'rectangle',
        properties: [0, 100, 810, 60],
        $isStatic: true
    }));
    field.addObject(PhysicObject.createColorSpot({
        shape: 'rectangle',
        properties: [0, 80, 100, 21]
    }));
}

module.exports = {
    create: create,
    assets: assets,
    spawn: [
        [0, 0],
        [10, 20]
    ]
}
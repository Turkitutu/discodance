const PhysicObject = require('../physics/object');

const assets = [

]

function construct(resources) {
    this.addObject(new PhysicObject({
        shape: 'rectangle',
        properties: [0, 100, 810, 60],
        $isStatic: true
    }));
    this.addObject(PhysicObject.createColorSpot({
        shape: 'rectangle',
        properties: [0, 80, 100, 21]
    }));
}

module.exports = {
    construct: construct,
    assets: assets,
    spawn: [
        [0, 0],
        [10, 20]
    ]
}
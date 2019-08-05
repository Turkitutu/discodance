const PhysicObject = require('../physics/object');

const assets = [

]

function construct(resources) {
    this.addObject(new PhysicObject({
        shape: new box2d.b2PolygonShape().SetAsBox(10, 0.5),
        x: 0,
        y: 5
    }));
    this.addObject(PhysicObject.createColor({
        shape: new box2d.b2PolygonShape().SetAsBox(1, 0.15),
        x: 0,
        y: 4.35
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
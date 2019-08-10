const PhysicObject = require('../physics/object');

const assets = [

]

function construct(resources) {
    this.addObject(new PhysicObject({
        shape: new box2d.b2PolygonShape().SetAsBox(10, 1),
        x: 0,
        y: 5
    }));
    this.addObject(new PhysicObject({
        shape: new box2d.b2PolygonShape().SetAsBox(9, 0.5),
        x: 0,
        y: 0
    }));
    this.addObject(new PhysicObject({
        shape: new box2d.b2PolygonShape().SetAsBox(7, 0.5),
        x: 0,
        y: -5
    }));
    for (let i = -1; i < 2; i += 2) {
        this.addObject(new PhysicObject({
            shape: new box2d.b2PolygonShape().SetAsBox(3, 2),
            x: 13*i,
            y: 4
        }));
        this.addObject(PhysicObject.createColorLine(2, 1, 0.15, {
            x: 14*i,
            y: 1.85
        }));
    }
    this.addObject(PhysicObject.createColorLine(10, 1, 0.15, {
        x: 0,
        y: 3.85
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
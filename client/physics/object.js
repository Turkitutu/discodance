const Bodies = Matter.Bodies,
      Body = Matter.Body;

class PhysicObject {
    constructor(shape, ...args) {
        this.body = Bodies[shape].apply(null, args);
    }
    teleport(x, y) {

    }
    translate(x, y) {

    }
    applyForce(x, y, valueX, valueY) {

    }
}

module.exports = PhysicObject;
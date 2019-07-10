const Bodies = Matter.Bodies,
      Body = Matter.Body;

class PhysicObject {
    constructor(options) {
        if (options.fixedRotation) {
            options.inertia = Infinity;   
        }

        options.properties.push(options);
        this.body = Bodies[options.shape].apply(null, options.properties);

        if (options.sprite) {
            this.sprite = options.sprite.object;
            this.size = options.sprite.size;
            this.origin = [-this.size[0]*options.sprite.anchor[0], this.size[1]*options.sprite.anchor[1]];
            if (options.sprite.scale)
                this.sprite.scale.set(options.sprite.scale[0], options.sprite.scale[1]);
        }

        this._vector = { x: 0, y: 0 };
        this._force = { x: 0, y: 0 };
    }
    teleport(x, y) {
        this._vector.x = x;
        this._vector.y = y;
        Body.setPosition(this.body, this._vector);
    }
    translate(x, y) {
        this._vector.x = x;
        this._vector.y = y;
        Body.translate(this.body, this._vector);
    }
    applyForce(x, y, valueX, valueY) {
        this._force.x = valueX;
        this._force.y = valueY;
        this._vector.x = x;
        this._vector.y = y;
        Body.applyForce(this.body, this._vector, this._force);
    }
    setVelocity(x, y) {
        this._vector.x = x || this.body.velocity.x;
        this._vector.y = y || this.body.velocity.y;
        Body.setVelocity(this.body, this._vector);
    }
    update() {
        if (this.sprite) {
            this.sprite.position.set(this.body.position.x+this.origin[0], this.body.position.y+this.origin[1]);
            this.sprite.rotation = this.body.angle;
        }
    }
}

module.exports = PhysicObject;
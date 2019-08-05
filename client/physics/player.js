const PhysicObject = require('./object.js');

module.exports = class Player extends PhysicObject {
    constructor(position/*, skin/clothes(?)*/) {
        super({
            shape: new box2d.b2PolygonShape().SetAsBox(0.3, 1),
            type: box2d.b2BodyType.b2_dynamicBody,
            x: position[0],
            y: position[1],
            friction: 5,
            sprite: {
                object: dragonBones.PixiFactory.factory.buildArmatureDisplay('body', 'character'),
                size: [0.3, 1],
                anchor: [0, 0.5],
                scale: [0.3, 0.3]
            },
            fixedRotation: true
        });
        this.movement = [];
        this.speed = 6;
        this.state = 'breath';
        this.isPlayer = true;
        this.color = null;
        this.impulse = new box2d.b2Vec2();
    }
    get state() {
        return this._state;
    }
    set state(value) {
        if (this._state !== value && this.can(value)) {
            this._state = value;
            this.sprite.$animation.fadeIn(value, 0.05);
        }
    }
    can(state) {
        switch (state) {
            case 'run':
                return this.state !== 'jump';
            default:
                return true;
        }
    }
    move() {
        if (this.movement[0] || this.movement[1]) {
            const factor = this.movement[0] ? 1 : -1,
                  vel = this.body.GetLinearVelocity(),
                  pos = this.body.GetPosition();
            this.state = 'run';
            this.sprite.$scale.$x = -Math.abs(this.sprite.$scale.$x)*factor;
            if (vel.x*factor < this.speed) {
                this.impulse.x = 0.80*factor;
                this.body.ApplyLinearImpulse(this.impulse, pos, true);
            }
        } else {
            this.state = 'breath';
        }
    }
    update() {
        this.move();

        super.update();
    }
    onColorTouch(color) {
        this.color = color;
    }
    onColorLeave(color) {
        if (this.color == color) {
            this.color = null;
        }
    }
    static handleMoves(input) {
        return [input.keyDown.right > input.keyDown.left, input.keyDown.right < input.keyDown.left];
    }
}
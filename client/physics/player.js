const PhysicObject = require('./object.js');

module.exports = class Player extends PhysicObject {
    constructor(/*skin/clothes(?)*/) {
        super({
            shape: 'rectangle',
            sprite: {
                object: dragonBones.$PixiFactory.$factory.$buildArmatureDisplay('body', 'character'),
                size: [30, 100],
                anchor: [0, 0.5],
                scale: [0.3, 0.3]
            },
            properties: [0, 0, 30, 100],
            fixedRotation: true,
            $frictionStatic: 1,
            $friction: 1,
            $frictionAir: 0.1
        });
        this.movement = [];
        this.speed = 10;
        this.state = 'breath';
        this.isPlayer = true;
        this.color = null;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        if (this._state !== value && this.can(value)) {
            this._state = value;
            this.sprite.$animation.$fadeIn(value, 0.05);
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
            const factor = this.movement[0] ? 1 : -1;
            this.state = 'run';
            this.sprite.$scale.$x = -Math.$abs(this.sprite.$scale.$x)*factor;
            this.setVelocity(this.speed*factor);
        } else {
            this.state = 'breath';
        }
    }
    update() {        
        this.move();

        super.update();
    }
    static handleMoves(input) {
        return [input.keyDown.right > input.keyDown.left, input.keyDown.right < input.keyDown.left];
    }
}
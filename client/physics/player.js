const PhysicObject = require('./object.js');

module.exports = class Player extends PhysicObject {
    constructor(position/*, skin/clothes(?)*/) {
        const width = 0.2,
              height = 0.5;
        super({
            shape: new box2d.b2PolygonShape().SetAsBox(width, height),
            type: box2d.b2BodyType.b2_dynamicBody,
            x: position[0],
            y: position[1],
            friction: 0.1,
            density: 3,
            restitution: 0,
            sprite: {
                object: dragonBones.PixiFactory.factory.buildArmatureDisplay('body', 'character'),
                anchor: [0, 0.5],
                scale: [0.3, 0.3]
            },
            fixedRotation: true
        });
        const sensor = new box2d.b2FixtureDef(),
              sensorSize = 0.04;
        sensor.$isSensor = true;
        sensor.$shape = new box2d.b2PolygonShape().SetAsBox(width, sensorSize, new box2d.b2Vec2(0, height-sensorSize));
        this.fixtures.push(sensor);
        this.width = width*100;
        this.height = height*100;
        this.movement = [];
        this.direction = -1;
        this.speed = 6;
        this.isPlayer = true;
        this.color = null;
        this.impulse = new box2d.b2Vec2();
        this.state = 'breath';
        this.jumps = 0;
    }
    playAnimation(value) {
        if (this.sprite.$animation.$lastAnimationName !== value) {
            this.sprite.$animation.fadeIn(value, 0.05);
        }
    }
    forceAnimation(value) {
        this.sprite.$animation.fadeIn(value, 0.05);
    }
    animate() {
        if (this.movement[2]) {
            if (this.jumps < 2) {
                this.jumps++;
                this.state = 'jump';
                this.forceAnimation('jump');
                const vel = this.body.GetLinearVelocity();
                vel.y = -5;
                this.body.SetLinearVelocity(vel);
            }
        }
        if (this.movement[0] || this.movement[1]) {
            if (this.state !== 'jump') {
                this.state = 'run';
                this.playAnimation('run');
            }
            const vel = this.body.GetLinearVelocity(),
                  pos = this.body.GetPosition(),
                  direction = this.movement[0] ? 1 : -1;
            if (direction!==this.direction) {
                this.sprite.$scale.$x *= -1;
                vel.x = 0;
                this.body.SetLinearVelocity(vel);
                this.direction = direction;
            }
            if (vel.x*direction < this.speed) {
                this.impulse.Set(0.80*direction, 0);
                this.body.ApplyLinearImpulseToCenter(this.impulse);
            }
        } 
        if (!(this.movement[0] || this.movement[1] || this.movement[2])) {
            if (this.state !== 'breath') {
                const vel = this.body.GetLinearVelocity();
                vel.x = 0;
                this.body.SetLinearVelocity(vel);
                if (this.state !== 'jump') {
                    this.playAnimation('breath');
                    this.state = 'breath';
                }
            }
        }
    }
    update() {
        this.animate();

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
    onLanding() {
        this.jumps = 0;
        this.state = '';
    }
    static handleMoves(input) {
        return [input.keyDown.right > input.keyDown.left, input.keyDown.right < input.keyDown.left, input.wasModified.up && input.keyDown.up];
    }
}
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
        const rightBottom = new box2d.b2FixtureDef(),
              leftBottom = new box2d.b2FixtureDef(),
              rightSide = new box2d.b2FixtureDef(),
              leftSide = new box2d.b2FixtureDef(),
              sensorSize = 0.04,
              sideSize = 0.01,
              sensorWidth = width/2-0.02,
              partHeight = height/2,
              pos = new box2d.b2Vec2(sensorWidth, height+sensorSize);
        leftBottom.$isSensor=rightBottom.$isSensor=rightSide.$isSensor=leftSide.$isSensor=true;
        leftBottom.bottom=rightBottom.bottom=leftBottom.left=rightBottom.right=rightSide.rightWall=leftSide.leftWall=true;
        rightBottom.$shape = new box2d.b2PolygonShape().SetAsBox(sensorWidth, sensorSize, pos);
        pos.x *= -1;
        leftBottom.$shape = new box2d.b2PolygonShape().SetAsBox(sensorWidth, sensorSize, pos);
        pos.x = width;
        pos.y = 0;
        rightSide.$shape = new box2d.b2PolygonShape().SetAsBox(sideSize, partHeight, pos);
        pos.x *= -1;
        leftSide.$shape = new box2d.b2PolygonShape().SetAsBox(sideSize, partHeight, pos);
        this.fixtures.push(rightBottom, leftBottom, rightSide, leftSide);
        this.left = {};
        this.right = {};
        this.bottom = 0;
        this.sliding = false;
        this.width = width*200;
        this.height = height*200;
        this.movement = [];
        this.direction = -1;
        this.speed = 6;
        this.isPlayer = true;
        this.color = null;
        this.impulse = new box2d.b2Vec2();
        this.state = 'breath';
        this.jumps = 0;
        window.$player = this;
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
    onColorTouch() {
        console.log('new color', this.color);
    }
    onColorLeave() {
        console.log('no color', this.color);
    }
    onLanding() {
        this.jumps = 0;
        this.state = '';
    }
    onSlide() {
        console.log('sliding');
    }
    onSlideLeave() {
        console.log('not sliding');
    }
    static handleMoves(input) {
        return [input.keyDown.right > input.keyDown.left, input.keyDown.right < input.keyDown.left, input.wasModified.up && input.keyDown.up];
    }
}
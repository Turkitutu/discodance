const PhysicObject = require('./object.js');

const states = {
    breath: 1,
    run: 2,
    jump: 3,
    jumpForward: 4
}

module.exports = class Player extends PhysicObject {
    constructor(position/*, skin/clothes(?)*/) {
        const width = 0.2,
              height = 0.5,
              scale = 0.3;
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
                scale: [scale, scale]
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
        this.scale = scale;
        this.direction = -1;
        this.nextDirection = -1;
        this.speed = 6;
        this.isPlayer = true;
        this.color = null;
        this.impulse = new box2d.b2Vec2();
        this.state = states.breath;
        this.jumps = 0;
        this.hasJumped = false;
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
        if (this.hasJumped) {
            if (this.jumps < 2) {
                this.jumps++;
                this.forceAnimation('jump');
                const vel = this.body.GetLinearVelocity();
                vel.y = -5;
                this.body.SetLinearVelocity(vel);
            } else {
                // report 
            }
            this.hasJumped = false;
        }
        if (this.state == states.run || this.state == states.jumpForward) {
            if (this.state == states.run) {
                this.playAnimation('run');
            }
            const vel = this.body.GetLinearVelocity(),
                  pos = this.body.GetPosition();
            if (this.nextDirection!==this.direction) {
                this.sprite.$scale.$x = -this.nextDirection*this.scale;
                vel.x = 0;
                this.body.SetLinearVelocity(vel);
                this.direction = this.nextDirection;
            }
            if (vel.x*this.direction < this.speed) {
                this.impulse.Set(0.80*this.direction, 0);
                this.body.ApplyLinearImpulseToCenter(this.impulse);
            }
        } else if (this.state == states.breath || this.state == states.jump) {
            if (this.direction) {
                if (this.state == states.breath) {
                    this.playAnimation('breath');
                }
                const vel = this.body.GetLinearVelocity();
                vel.x = 0;
                this.body.SetLinearVelocity(vel);
                this.direction = 0;
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
        if (this.state == states.jumpForward) {
            this.state = states.run;
        } else {
            this.state = states.breath;
            this.direction = this.nextDirection;
        }
    }
    onSlide() {
        console.log('sliding');
    }
    onSlideLeave() {
        console.log('not sliding');
    }
    readInput(input) {
        const holdingRight = input.keyDown.right > input.keyDown.left,
              holdingLeft = input.keyDown.right < input.keyDown.left,
              pressedUp = input.keyDown.up && input.wasModified.up;
        if (holdingLeft || holdingRight || pressedUp) {
            if (pressedUp) {
                if (this.jumps < 2 && !this.sendJumping) {
                    this.hasJumped = true;
                    this.sendJumping = true;
                    this.state = states.jump;
                }
            }
            if (holdingLeft || holdingRight) {
                if (this.state == states.jump) {
                    this.state = states.jumpForward;
                } else if (this.state != states.jumpForward) {
                    this.state = states.run;
                }
                this.nextDirection = holdingRight ? 1 : -1;
            } 
        } else if (this.state != states.jump) {
            this.state = this.state == states.jumpForward ? states.jump : states.breath;
        }
    }
    hasChanged() {
        return !this.prevData || this.prevData[0] != this.state || this.prevData[1] != this.sendJumping || this.prevData[2] != this.nextDirection;
    }
    writePacket(packet) {
        let state = this.state;
        this.prevData = [state, this.sendJumping, this.nextDirection];
        if (this.sendJumping) {
            state |= 128;
            this.sendJumping = false;
        }
        if (this.nextDirection == 1) {
            state |= 64;
        }
        packet.writeBytes(state, 1);
    }
    readPacket(packet) {
        const state = packet.readBytes(1);
        this.hasJumped = state >> 7;
        this.nextDirection = ((state >> 6) & 1) || -1;
        this.state = state & 63;
        //TODO: read x, y, vx, vy : correct mistakes or report hacker
    }
}
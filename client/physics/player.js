const PhysicObject = require('./object.js');

module.exports = class Player extends PhysicObject {

    constructor(/*skin/clothes(?)*/) {
        const resources = PIXI.loaders.shared.resources,
              factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(resources.character.data);
        factory.parseTextureAtlasData(resources.character_info.data, resources.character_tex.texture);
        super({
            shape: 'rectangle',
            sprite: {
                object: factory.buildArmatureDisplay('body', 'character'),
                size: [30, 100],
                anchor: [0, 0.5],
                scale: [0.3, 0.3]
            },
            properties: [0, 0, 30, 100],
            frictionStatic: 1,
            friction: 1,
            frictionAir: 0.1,
            fixedRotation: true
        });
        this.movement = [];
        this.speed = 10;
        this.state = 'breath';
        //this.body.frictionStatic = Infinity
        //this.body.friction = Infinity
        this.graphics = new PIXI.Graphics();
    }
    get state() {
        return this._state;
    }
    set state(value) {
        if (this._state !== value && this.can(value)) {
            this._state = value;
            this.sprite.animation.fadeIn(value, 0.05);
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
            this.sprite.scale.x = -Math.abs(this.sprite.scale.x)*factor;
            this.setVelocity(this.speed*factor);
        } else {
            this.state = 'breath';
        }
    }
    update() {        
        this.move();

        super.update();

        this.graphics.clear();
        this.graphics.lineStyle(2, 0xFF0000);
        this.graphics.drawRect(this.body.position.x-this.size[0]/2, this.body.position.y-this.size[1]/2, this.size[0], this.size[1]);
    }

}
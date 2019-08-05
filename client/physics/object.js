const Emitter = require('../utils/emitter.js');

class PhysicObject extends Emitter {
    constructor(options) {
        super();

        this.bodyDef = new box2d.b2BodyDef();
        this.bodyDef.$type = options.type || box2d.b2BodyType.b2_staticBody;
        this.bodyDef.$position.Set(options.x || 0, options.y || 0);
        this.bodyDef.$angle = options.angle ? options.angle*box2d.b2_pi_over_180 : 0;
        this.bodyDef.$fixedRotation = options.fixedRotation;
        this.shape = options.shape;

        this.fixtureDef = new box2d.b2FixtureDef();
        this.fixtureDef.$shape = this.shape;
        this.fixtureDef.$density = options.density!==undefined ? options.density : 1;
        this.fixtureDef.$friction = options.friction!==undefined ? options.friction : 0.3;
        this.fixtureDef.$restitution = options.restitution!==undefined ? options.restitution : 0.2;
        this.fixtureDef.$isSensor = options.isSensor;

        if (options.sprite) {
            this.sprite = options.sprite.object;
            this.origin = [-options.sprite.size[0]*options.sprite.anchor[0]*100, options.sprite.size[1]*options.sprite.anchor[1]*100];
            if (options.sprite.scale)
                this.sprite.$scale.set(options.sprite.scale[0], options.sprite.scale[1]);
        }
    }
    static createColor(options) {
        options.isSensor = true;
        const obj = new this(options);
        obj.isColor = true;
        obj.id = options.id;
        return obj;
    }
    update() {
        if (this.sprite && this.body) {
            const position = this.body.GetPosition();
            window.$ho ? '' : window.$ho=!console.log(this.sprite);
            this.sprite.$position.set(position.$x*100+this.origin[0], position.$y*100+this.origin[1]);
        }
    }
}

module.exports = PhysicObject;
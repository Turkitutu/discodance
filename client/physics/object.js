const Emitter = require('../utils/emitter.js');

class PhysicObject extends Emitter {
    constructor(options) {
        super();

        this.bodyDef = new box2d.b2BodyDef();
        this.bodyDef.$type = options.type || box2d.b2BodyType.b2_staticBody;
        this.bodyDef.$position.Set(options.x || 0, options.y || 0);
        this.bodyDef.$angle = options.angle ? options.angle*box2d.b2_pi_over_180 : 0;
        this.bodyDef.$fixedRotation = options.fixedRotation;

        const fixtureDef = new box2d.b2FixtureDef();
        fixtureDef.$shape = options.shape;
        fixtureDef.$density = options.density!==undefined ? options.density : 1;
        fixtureDef.$friction = options.friction!==undefined ? options.friction : 0.3;
        fixtureDef.$restitution = options.restitution!==undefined ? options.restitution : 0.2;
        fixtureDef.$isSensor = options.isSensor;

        this.fixtures = [fixtureDef];

        if (options.sprite) {
            this.sprite = options.sprite.object;
            if (options.sprite.scale) {
                this.sprite.$scale.set(options.sprite.scale[0], options.sprite.scale[1]);
            }
            const baseTexture = this.sprite.$texture.$baseTexture;
            this.origin = [-baseTexture.$width*options.sprite.anchor[0], baseTexture.$height*options.sprite.anchor[1]];
        }
    }
    static createColorLine(colorCount, colorWidth, colorHeight, options) {
        const width = colorWidth*colorCount,
              tolerance = options.tolerance || 0.05;
        options.shape = new box2d.b2PolygonShape().SetAsBox(width, colorHeight);
        const colorLine = new this(options),
              position = new box2d.b2Vec2(-width+colorWidth, -tolerance),
              colorRealWidth = colorWidth*2,
              newHeight = colorHeight + tolerance;
        for (let i = 0; i < colorCount; i++) {
            const fixture = new box2d.b2FixtureDef();
            fixture.$shape = new box2d.b2PolygonShape().SetAsBox(colorWidth, newHeight, position);
            fixture.$isSensor = true;
            fixture.isColor = true;
            colorLine.fixtures.push(fixture);
            position.x += colorRealWidth;
        }
        return colorLine;
    }
    static addColor(options) {
        options.restitution = options.restitution || 0;
        const obj = new this(options);
        obj.isColor = true;
        obj.id = options.id;
        return obj;
    }
    update() {
        if (this.sprite && this.body) {
            const position = this.body.GetPosition();
            this.sprite.$position.set(position.$x*100+this.origin[0], position.$y*100+this.origin[1]);
            this.sprite.$rotation = this.body.GetAngle();
        }
    }
}

module.exports = PhysicObject;
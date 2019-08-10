const DebugDraw = require('./debug.js'),
      ContactListener = require('./contact.js');

const TIME_STEP = 1/60,
      VELOCITY_ITERATIONS = 6,
      POSITION_ITERATIONS = 2;

class GameWorld {
    constructor(options) {
        this.b2world = new box2d.b2World(new box2d.b2Vec2(options.wind || 0, options.gravity || 10), true);
        this.debug = new DebugDraw();
        this.b2world.SetDebugDraw(this.debug);
        this.debug.enabled = options.debug;
        this.debug.renderer.$scale.set(100, 100);
        this.b2world.SetContactListener(new ContactListener());
        this.colors = [];
    }
    add(obj) {
        obj.body = this.b2world.CreateBody(obj.bodyDef);
        for (const fixture of obj.fixtures) {
            const fixt = obj.body.CreateFixture(fixture);
            if (fixture.isColor) {
                fixt.isColor = true;
                fixt.colorCode = Math.floor(Math.random()*0xffffff);
                this.colors.push(fixt);
            }
            fixt.bottom = fixture.bottom;
            fixt.left = fixture.left;
            fixt.right = fixture.right;
            fixt.leftWall = fixture.leftWall;
            fixt.rightWall = fixture.rightWall;
        }
        delete obj.fixtures;
        obj.body.physicObject = obj;
    }
    update(delta) {
        if (this.debug.enabled) {
            this.debug.clear();
            this.b2world.DrawDebugData();
        }
        this.b2world.Step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
    }
    clear() {
        this.colors = [];
        //World.$clear(this.engine.$world);
        //Engine.clear(this.engine);
    }
}

module.exports = GameWorld;
const DebugDraw = require('./debug.js');

const TIME_STEP = 1/60,
      VELOCITY_ITERATIONS = 6,
      POSITION_ITERATIONS = 2;

class ContactListener extends box2d.b2ContactListener {
    constructor() {
        super();
    }
    beginContact(contact) {
        const bodyA = this.m_fixtureA.GetBody().physicObject;
        if (bodyA) {
            const bodyB = this.m_fixtureB.GetBody().physicObject;
            if (bodyB) {
                if (bodyA.isColor && bodyB.isPlayer) {
                    bodyB.onColorTouch(bodyA);
                } else if (bodyA.isPlayer && bodyB.isColor) {
                    bodyA.onColorTouch(bodyB);
                }
            }
        }
    }
    endContact(contact) {
        const bodyA = this.m_fixtureA.GetBody().physicObject;
        if (bodyA) {
            const bodyB = this.m_fixtureB.GetBody().physicObject;
            if (bodyB) {
                if (bodyA.isColor && bodyB.isPlayer) {
                    bodyB.onColorLeave(bodyA);
                } else if (bodyA.isPlayer && bodyB.isColor) {
                    bodyA.onColorLeave(bodyB);
                }
            }
        }
    }
}

function emit(event) {
    for (const pair of event.$pairs) {
        const bodyA = pair.$bodyA,
              bodyB = pair.$bodyB;
        if (bodyA.object && bodyB.object) {
            bodyA.object.emit(event.$name, bodyB.object);
            bodyB.object.emit(event.$name, bodyA.object);
        } 
    }
}

class GameWorld {
    constructor(options) {
        this.b2world = new box2d.b2World(new box2d.b2Vec2(options.wind || 0, options.gravity || 10), true);
        this.debug = new DebugDraw();
        this.b2world.SetDebugDraw(this.debug);
        this.debug.enabled = options.debug;
        this.accumulator = 0;
        this.debug.renderer.$scale.set(100, 100);
        this.b2world.SetContactListener(new ContactListener());
    }
    add(obj) {
        obj.body = this.b2world.CreateBody(obj.bodyDef);
        obj.fixture = obj.body.CreateFixture(obj.fixtureDef);
        obj.body.physicObject = obj;
    }
    update(delta) {
        if (this.debug.enabled) {
            this.debug.clear();
            this.b2world.DrawDebugData();
        }
        const frameTime = Math.min(TIME_STEP+delta/1000, 0.25);
        this.accumulator += frameTime;
        while (this.accumulator >= TIME_STEP) {
            this.b2world.Step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
            this.accumulator -= TIME_STEP;
        }
    }
    clear() {
        //World.$clear(this.engine.$world);
        //Engine.clear(this.engine);
    }
}

module.exports = GameWorld;
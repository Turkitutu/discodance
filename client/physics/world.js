const DebugDraw = require('./debug.js');

const TIME_STEP = 1/60,
      VELOCITY_ITERATIONS = 6,
      POSITION_ITERATIONS = 2;

class ContactListener extends box2d.b2ContactListener {
    constructor() {
        super();
    }
    $BeginContact(contact) {
        const bodyA = contact.$m_fixtureA.GetBody().physicObject;
        if (bodyA) {
            const bodyB = contact.$m_fixtureB.GetBody().physicObject;
            if (bodyB) {
                if (bodyA.isPlayer) {
                    if (contact.$m_fixtureA.IsSensor()) {
                        bodyA.onLanding();
                    } else if (bodyB.isColor) {
                        bodyA.onColorTouch(bodyB);
                    }
                }
                if (bodyB.isPlayer) {
                    if (contact.$m_fixtureB.IsSensor()) {
                        bodyB.onLanding();
                    } else if (bodyA.isColor) {
                        bodyB.onColorTouch(bodyA);
                    }
                }
            }
        }
    }
    $EndContact(contact) {
        const bodyA = contact.$m_fixtureA.GetBody().physicObject;
        if (bodyA) {
            const bodyB = contact.$m_fixtureB.GetBody().physicObject;
            if (bodyB) {
                if (bodyA.isColor && bodyB.isPlayer && !contact.$m_fixtureB.IsSensor()) {
                    bodyB.onColorLeave(bodyA);
                } else if (bodyA.isPlayer && bodyB.isColor && !contact.$m_fixtureA.IsSensor()) {
                    bodyA.onColorLeave(bodyB);
                }
            }
        }
    }
}

class GameWorld {
    constructor(options) {
        this.b2world = new box2d.b2World(new box2d.b2Vec2(options.wind || 0, options.gravity || 10), true);
        this.debug = new DebugDraw();
        this.b2world.SetDebugDraw(this.debug);
        this.debug.enabled = options.debug;
        this.debug.renderer.$scale.set(100, 100);
        this.b2world.SetContactListener(new ContactListener());
    }
    add(obj) {
        obj.body = this.b2world.CreateBody(obj.bodyDef);
        for (const fixture of obj.fixtures) {
            obj.body.CreateFixture(fixture);
        }
        delete obj.fixtures;
        obj.body.physicObject = obj;
    }
    remove(obj) {
        this.b2world.DestroyBody(obj.body);
        delete obj.body;
    }
    update(delta) {
        if (this.debug.enabled) {
            this.debug.clear();
            this.b2world.DrawDebugData();
        }
        this.b2world.Step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
    }
    clear() {
        //World.$clear(this.engine.$world);
        //Engine.clear(this.engine);
    }
}

module.exports = GameWorld;
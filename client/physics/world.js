const Composite = Matter.Composite,
      Engine = Matter.Engine,
      World = Matter.World,
      Events = Matter.Events,
      FPMS = PIXI.settings.TARGET_FPMS;

function emit(event) {
    for (const pair of event.pairs) {
        if (pair.bodyA.object && pair.bodyB.object) {
            pair.bodyA.object.emit(event.name, pair.bodyB.object);
            pair.bodyB.object.emit(event.name, pair.bodyA.object);
        } 
    }
}

class GameWorld {
    constructor(options) {
        this.engine = Engine.create({
            world: World.create(options)
        });
        Events.on(this.engine, "collisionStart", emit);
        Events.on(this.engine, "collisionActive", emit);
        Events.on(this.engine, "collisionEnd", emit);
        this.lastDelta = 0;
        this._debug = options.debug;
        this.renderer = new PIXI.Graphics();
    }
    add(obj) {
        World.add(this.engine.world, [].concat(obj).map(p => p.body));
    }
    update(delta) {
        Engine.update(this.engine, delta/FPMS, this.lastDelta ? delta/this.lastDelta : 1);
        this.lastDelta = delta;

        if (this._debug) {
            this.renderDebug();
        }
    }
    clear() {
        //World.clear(this.engine.world);
        Engine.clear(this.engine);
    }
    get debug() {
        return this._debug;
    }
    set debug(value) {
        this._debug = value;
        if (!value)
            this.renderer.clear();
    }
    renderDebug() {
        const bodies = Composite.allBodies(this.engine.world);

        this.renderer.clear();
        this.renderer.lineStyle(4, 0x999999); 

        for (const body of bodies) {
            const vertices = body.vertices,
                  last = vertices[vertices.length-1];
            this.renderer.moveTo(last.x, last.y);

            for (const vertice of vertices) {
                this.renderer.lineTo(vertice.x, vertice.y);
            }
        }
    }
}

module.exports = GameWorld;
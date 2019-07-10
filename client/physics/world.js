const Composite = Matter.Composite,
      Engine = Matter.Engine,
      World = Matter.World,
      FPMS = PIXI.settings.TARGET_FPMS;

class GameWorld {
    constructor(options) {
        this.engine = Engine.create({
            world: World.create(options)
        });
        this.lastDelta = 0;
        this._debug = options.debug;
        this.renderer = new PIXI.Graphics();
    }
    add(obj) {
        World.add(this.engine.world, obj);
    }
    update(delta) {
        Engine.update(this.engine, delta/FPMS, this.lastDelta ? delta/this.lastDelta : 1);
        this.lastDelta = delta;

        if (this._debug) {
            this.renderDebug();
        }
    }
    static handleMoves(input) {
        return [input.keyDown['right'] > input.keyDown['left'], input.keyDown['right'] < input.keyDown['left']];
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
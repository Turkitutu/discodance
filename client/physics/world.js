const FPMS = PIXI.settings.TARGET_FPMS;

class World {
    constructor(options) {
        this.engine = Matter.Engine.create({
            world: Matter.World.create(options)
        });
        this.lastDelta = 0;
    }
    add(obj) {
        Matter.World.add(this.engine.world, obj);
    }
    update(delta) {
        Matter.Engine.update(this.engine, delta/FPMS, this.lastDelta ? delta/this.lastDelta : 1);
        this.lastDelta = delta;
    }
    static handleMoves(input) {
        return [input.keyDown['right'] > input.keyDown['left'], input.keyDown['right'] < input.keyDown['left']];
    }
}

module.exports = World;
class World {
    constructor() {
        this.engine = Matter.Engine.create();
        this.lastDelta = 0;
    }
    add(obj) {
        Matter.World.add(this.engine.world, obj);
    }
    update(delta) {
        Matter.Engine.update(this.engine, delta, this.lastDelta ? delta/this.lastDelta : 1);
        this.lastDelta = delta;
    }
}

module.exports = World;
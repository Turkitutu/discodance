const Scene = require('../core/scene.js'),
      PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js'),
      fields = require('../fields/');

class Field extends Scene {
    constructor() {
        super();
        this.reset();
        fields.forEach(field => field.construct = field.construct.bind(this));
    }
    reset() {
        this.playerList = [];
        this.loaded = false;
        this.spawnOffset = 0;
        this.field = null;
    }
    play() {
        this.scenes.interface.play();
        
        this.field = fields[this.world.fieldId];
        
        PhysicObject.colorTarget = this.playerList;
        
        PIXI.loaders.shared
            .add(this.field.assets)
            .load((loader, resources) => {
                this.field.construct(resources);
                this.loaded = true;
                this.load();
            });

        this.enable();
    }
    load() {
        this.camera.target(this);

        this.player = new Player(this.nextSpawn());
        this.addPlayer(this.player);

        this.addChild(this.world.debug.renderer);

        this.camera.focus(this.playerList);
        this.camera.zoom(0.1);
    }
    update(delta) {
        if (!this.loaded) return;

        this.player.movement = Player.handleMoves(this.input);

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
    }
    disable() {
        this.world.clear();
        for (const child of this.$children) {
            this.removeChild(child);
            child.destroy(true);
        }
        this.reset();

        super.disable();
    }
    nextSpawn() {
        return this.field.spawn[this.spawnOffset++] || this.field.spawn[this.spawnOffset=0];
    }
    addPlayer(player) {
        this.addObject(player);
        this.playerList.push(player);
    }
    addObject(obj) {
        this.world.add(obj);
        if (obj.sprite) this.addChild(obj.sprite);
    }
}

module.exports = Field;
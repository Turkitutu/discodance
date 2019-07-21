const PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js');

module.exports = class Battle extends PIXI.Container {
    constructor() {
        super();
        this.name = 'battle';
    }
    play() {
        //TODO: Get room info, add new player, send new player info (?), display players
        const fieldId = 0;

        this.field = this.scenes.play('field', false, fieldId);
        this.player = new Player();
        this.player2 = new Player();
        
        this.addPlayer(this.player);
        this.addPlayer(this.player2);

        this.addObject(new PhysicObject({
            shape: 'rectangle',
            properties: [0, 100, 810, 60],
            isStatic: true
        }));

        this.world.add(this.objectList);

        this.addChild(this.world.renderer);

        this.camera.focus(this.playerList);
        this.camera.zoom(0.7);
    }
    disable() {
        for (const child of this.children)
            this.removeChild(child);

        this.visible = false;
        this.scenes.disable();
    }
    update(delta) {
        this.player.movement = Player.handleMoves(this.input);
        this.player2.movement = this.player.movement[0] !== this.player.movement[1] ? [!this.player.movement[0], this.player.movement[0]] : this.player.movement;

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
    }
}
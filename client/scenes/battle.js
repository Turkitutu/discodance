const PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js');

module.exports = class battle extends PIXI.Container {
    constructor() {
        super();
        this.name = 'battle';
    }
    play() {
        this.playerList = []; // or {} idk;
        
        //TODO: Get room info, add new player, send new player info (?), display players
        
        this.player = new Player();
        this.playerList.push(this.player);
        
        const test_ground = new PhysicObject({
            shape: 'rectangle',
            properties: [0, 100, 810, 60],
            isStatic: true
        });

        this.world.add([test_ground, this.player]);

        this.addChild(this.player.sprite);

        this.addChild(this.world.renderer);

        this.camera.focus([this.player]);
        this.camera.zoom(0.3)
    }
    disable() {
        this.world.clear();
        //remove all childs

        super.disable();
    }
    update(delta) {
        this.player.movement = Player.handleMoves(this.input);

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
    }    
}
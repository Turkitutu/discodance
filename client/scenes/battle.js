const PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js');

module.exports = class battle extends PIXI.Container {
    constructor() {
        super();
        this.name = 'battle';
        this.playerList = []; // or {} idk;
        this.objectList = [];
    }
    play() {
        //TODO: Get room info, add new player, send new player info (?), display players
        
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
        this.world.clear();
        for (const child of this.children)
            this.removeChild(child);
        this.playerList = [];
        this.objectList = [];

        super.disable();
    }
    update(delta) {
        this.player.movement = Player.handleMoves(this.input);
        this.player2.movement = this.player.movement[0] !== this.player.movement[1] ? [!this.player.movement[0], this.player.movement[0]] : this.player.movement;

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
    }
    addPlayer(player) {
        this.playerList.push(player);
        this.addObject(player);
        this.addChild(player.sprite)
    }
    addObject(obj) {
        this.objectList.push(obj);
    }
}
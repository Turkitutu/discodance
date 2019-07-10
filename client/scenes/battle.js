const World = require('../physics/world.js'),
      PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js');

module.exports = class battle extends PIXI.Container {
    constructor() {
        super();
        this.name = 'battle';
        this.playerList = []; // or {} idk;
    }

    play() {
        this.world = new World({
            gravity: {
                x: 0,
                y: 3
            }
        });
        
        //TODO: Get room info, add new player, send new player info (?), display players
        
        this.player = new Player('character', 0, 0);
        this.playerList.push(this.player);
        var test_ground = Matter.Bodies.rectangle(0, 100, 810, 60, { isStatic: true });
        this.world.add([test_ground, this.player.body]);

        this.addChild(this.player.sprite);

        var a = new PIXI.Graphics();
        a.lineStyle(2, 0xFF0000);
        a.drawRect(-810/2, 100-60/2, 810, 60);
        this.addChild(a);

        this.addChild(this.player.graphics);
    }

    update(delta){
        this.player.movement = World.handleMoves(this.input);

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
    }
    
}
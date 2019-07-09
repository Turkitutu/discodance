const World = require('../physics/world.js'),
      PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js');

module.exports = class battle extends PIXI.Container {
    constructor() {
        super();
        this.name = 'batlle';
        this.playerList = []; // or {} idk;
    }

    play() {
        this.world = new World();
        
        //TODO: Get room info, add new player, send new player info (?), display players
        
        this.player = new Player('character', 0, 0);

        var test_ground = Matter.Bodies.rectangle(0, 100, 810, 60, { isStatic: true });
        Matter.World.add(this.engine.world, [test_ground, this.player.body]);

        this.addChild(this.player.character);

        var a = new PIXI.Graphics();
        a.lineStyle(2, 0xFF0000);
        a.drawRect(-810/2, 100-60/2, 810, 60);
        this.addChild(a);
    }

    update(delta){
        if (this.input.keyDown.right == this.input.keyDown.left) {
            this.player.isMoving = false;
        } else if (this.input.keyDown.right > this.input.keyDown.left) {
            this.player.isMoving = true;
            this.player.isMovingRight = true;
        } else {
            this.player.isMoving = true;
            this.player.isMovingRight = false;
        }
        this.player.update();
        this.world.update(delta);
    }
    
}
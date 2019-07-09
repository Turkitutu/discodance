const Player = require('../physics/player.js')

module.exports = class test extends PIXI.Container {
    constructor() {
        super();
        this.name = 'test';
        this.fps = 1000 / 60;
    }

    play() {
        this.engine = Matter.Engine.create();
        //Matter.Engine.run(this.engine);

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
        Matter.Engine.update(this.engine, this.fps+delta);
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
    }
    
}



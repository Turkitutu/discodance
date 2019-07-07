const Player = require('../player.js')

module.exports = class test extends PIXI.Container {
    constructor() {
        super();
        this.name = 'test';
    }

    play() {
        this.engine = Matter.Engine.create();
        Matter.Engine.run(this.engine);

        const resources = PIXI.loaders.shared.resources;
        this.player = new Player(resources, 'character', 200, 100);

        var test_ground = Matter.Bodies.rectangle(400, 500, 810, 60, { isStatic: true });
        Matter.World.add(this.engine.world, [test_ground, this.player.body]);

        this.addChild(this.player.character);

        var a = new PIXI.Graphics();
        a.lineStyle(2, 0xFF0000);
        a.drawRect(400-810/2, 500-60/2, 810, 60);
        this.addChild(a);
    }

    update(){
        this.player.update();
    }
    
}



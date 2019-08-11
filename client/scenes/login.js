const Scene = require('../core/scene.js'),
      { cogs } = require('../utils/enums.js'),
      SystemUI = require('../core/system-ui.js');

module.exports = class login extends Scene {
    constructor() {
        super();
    }

    play() {
        const resources = PIXI.loaders.shared.resources;

        var logo = new PIXI.Sprite(resources.$logo_splash.$texture);
        logo.$scale.set(2, 2);
        logo.$position.set(-logo.$width/2, -700);
        this.addChild(logo);

        this.enable();
    }

    update(delta){
        if (this.input.keyDown.enter) {
            //this.world.fieldId = 0;
            //this.scenes.field.play();
            this.scenes.village.play();
            this.disable();
        }
    }
    
}
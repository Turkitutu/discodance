const Scene = require('../core/scene.js'),
      { cogs } = require('../utils/enums.js');

module.exports = class login extends Scene {
    constructor() {
        super();
    }

    play() {
        const resources = PIXI.loaders.shared.resources;

        const logo = new PIXI.Sprite(resources.$logo_splash.$texture);
        logo.$scale.set(2, 2);
        logo.$position.set(-logo.$width/2, -700);
        this.addChild(logo);

        const mainScreen = EZGUI.create({
            $id: 'myWindow',
            $component: 'Window',
            $header: { $position: { $x: 0, $y: 0 }, $height: 80, $text: 'Header' },
            $draggable: true,
            $position: { $x: 0, $y: 0 },
            $width: 1000,
            $height: 500, 
            $layout: [1, 3],
            $children: [
                null,
                {
                    $id: 'button1',
                    $component: 'Button',
                    $position: 'center',
                    $text: 'Click Me',
                    $width: 400,
                    $height: 160
                }
            ]
        }, 'metalworks');
        this.addChild(mainScreen);

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
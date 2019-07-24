const cogs = require('../utils/enums.js').cogs;

module.exports = class login extends PIXI.$Container {
    constructor() {
        super();
        this.name = 'login';
    }

    play() {
        const resources = PIXI.$loaders.$shared.$resources;
        var style = {
            input: {fontSize: '16px', fontFamily: 'Tahoma', color: '#ffffff', textAlign: 'center'}, 
            box: {
                default: {fill: 0x000000, rounded: 20, stroke: {color: 0x2196F3, width: 2}},
                focused: {fill: 0x000000, rounded: 20, stroke: {color: 0x8BC34A, width: 2}},
                disabled: {fill: 0x141414, rounded: 20, stroke: {color: 0xf44336, width: 2}}
            }
        }

        var logo = new PIXI.$Sprite(resources.$logo_splash.$texture);
        logo.$scale.$set(2, 2);
        logo.$position.$set(-logo.$width/2, -700);
        this.$addChild(logo);

    }

    update(delta){
        if (this.input.keyDown.enter) {
            this.world.fieldId = 0;
            this.scenes.play('field');
            this.disable();
        }
    }
    
}
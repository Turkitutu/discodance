const cogs = require('../utils/enums').cogs,
      ByteArray = require('.../shared/bytearray.js');

module.exports = class login extends PIXI.Container {
    constructor() {
        super();
        this.name = 'login';
    }

    play() {
        const resources = PIXI.loaders.shared.resources;
        var style = {
            input: {fontSize: '16px', fontFamily: 'Tahoma', color: '#ffffff', textAlign: 'center'}, 
            box: {
                default: {fill: 0x000000, rounded: 20, stroke: {color: 0x2196F3, width: 2}},
                focused: {fill: 0x000000, rounded: 20, stroke: {color: 0x8BC34A, width: 2}},
                disabled: {fill: 0x141414, rounded: 20, stroke: {color: 0xf44336, width: 2}}
            }
        }

        var logo = new PIXI.Sprite(resources.logo_spalsh.texture);
        logo.scale.set(2, 2);
        logo.position.set(-logo.width/2, -700);
        this.addChild(logo);

        var nickname = new PIXI.TextInput(style);
        nickname.substituteText = false;
        nickname.x = -nickname.width/2;
        nickname.y = 100;
        nickname.placeholder = 'Nickname';
        this.addChild(nickname);
        nickname.focus();
        this.input.preventDefault = false;

        var password = new PIXI.TextInput(style);
        password.substituteText = false;
        password.disabled = true;
        password.x = -password.width/2;
        password.y = 130;
        password.placeholder = 'Password';
        this.addChild(password);  

        nickname.on('blur', () => {this.input.preventDefault = true});
        nickname.on('focus', () => {this.input.preventDefault = false});  
        password.on('blur', () => {this.input.preventDefault = true});
        password.on('focus', () => {this.input.preventDefault = false}) ;   

        // Exemple
        this.connection.packet(false, cogs.login.id, cogs.login.login, function(name, pass){
            // do something
            return new ByteArray().writeString(name).writeString(pass);
        });

        this.connection.send(cogs.login.id, cogs.login.login, 'yatsuki', '12345679');

        this.connection.packet(true, cogs.login.id, cogs.login.result, function(data){
            // do something
        });

    }

    update(delta){
        if (this.input.keyDown.enter) {
            this.world.fieldId = 0;
            this.scenes.play('field');
            this.disable();
        }
    }
    
}

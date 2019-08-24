const Scene = require('../core/scene.js'),
      {incoming, outgoing, cogs:{login}} = require('../utils/enums.js'),
      SystemUI = require('../core/system-ui.js');

module.exports = class Login extends Scene {
    constructor() {
        super();
    }

    play() {
        const resources = PIXI.loaders.shared.resources;
        this.connection.use(incoming, login.id, (packet) => {
            return packet.getSpecialByte(6);
        });

        this.connection.use(outgoing, login.id, (id, packet) => {
            packet.setSpecialByte(id, 6);
        });

        this.connection.packet(outgoing, login.id, login.send_request, (packet, username, password) => {
            packet.writeString(username);
            packet.writeString(password);
        });

        this.connection.packet(incoming, login.id, login.on_error, packet => {
            const id = packet.readUInt();
            switch (id) {
                case 0: 
                    console.log('Invalid nickname or password !');
                    break;
                case 1: 
                    console.log('Aready connected !');
                    break;
            }
        });

        this.connection.packet(incoming, login.id, login.on_success, packet => {
            console.log('Connected');
            this.scenes.village.play();
            this.disable();
        });

        window.$sendLogin = (username, password) => this.connection.send(login.id, login.send_request, username, password);
        /*/
        const popup = [];
        popup[0] = new SystemUI.Popup({headerTitle: "Login", position: {x: 80, y: 50}, size: {w: 600,  h:200, max: {h: 1000}}});
        popup[1] = new SystemUI.TextInput({style: {$fontSize: "38px"}, position: {x: 83, y: 25}, size: {w: 500,  h:40, max: {h: 40}}});
        popup[2] = new SystemUI.TextInput({style: {$fontSize: "38px"}, position: {x: 83, y: 65}, size: {w: 500,  h:40, max: {h: 40}}});
        for (const n of popup){
            n.show();
            this.camera.center(n);
        }
        /*/

        var logo = new PIXI.Sprite(resources.$logo_splash.$texture);
        logo.$scale.set(2, 2);
        logo.$position.set(-logo.$width/2, -700);
        this.addChild(logo);

        this.input.preventDefault = false;
        this.enable();
    }

    update(delta){
        if (this.input.keyDown.enter) {
            //this.world.fieldId = 0;
            //this.scenes.field.play();
            //this.scenes.village.play();
            //this.disable();
        }
    }
    
}
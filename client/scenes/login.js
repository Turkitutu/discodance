const Scene = require('../core/scene.js'),
      {incoming, outgoing, cogs:{login}} = require('../utils/enums.js');


module.exports = class Login extends Scene {
    constructor() {
        super();
        this.enterPressed = false;
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
            this.enterPressed = false;
        });

        this.connection.packet(incoming, login.id, login.on_success, packet => {
            console.log('Connected');
            this.scenes.village.play();
            this.disable();
            //this.world.fieldId = 0;
            //this.scenes.field.play();
            //this.scenes.village.play();
            //this.disable();
        });

        const logo = new PIXI.Sprite(resources.$logo_splash.$texture);
        logo.$scale.set(2, 2);
        logo.$position.set(-logo.$width/2, -700);
        this.addChild(logo);

        this.input.preventDefault = false;
        const mainScreen = EZGUI.create({
            $id: 'myWindow',
            $component: 'Window',
            $padding: 1,
            $header: { $position: { $x: 0, $y: 0 }, $height: 80, $text: 'Login' },
            $draggable: true,
            $position: { $x: -500, $y: 0 },
            $width: 1000,
            $height: 500, 
            $layout: [1, 4],
            $children: [
                null,
                {
                    $id: 'nickname',
                    $component: 'Input',
                    $position: 'top center',
                    $width: 500,
                    $height: 50,
                },
                {
                    $id: 'password',
                    $component: 'Input',
                    $position: 'top center',
                    $width: 500,
                    $height: 50,
                    $type: 'password'
                },
                {
                    $id: 'submit',
                    $component: 'Button',
                    $position: 'top center',
                    $text: 'Submit',
                    $width: 400,
                    $height: 90
                }
            ]
        }, 'metalworks');

        const comp = EZGUI.components;

        comp.$submit.$once("mousedown", e => {
            this.sendRequest(comp.$nickname.$text, comp.$password.$text);
        });

        this.addChild(mainScreen);
        window.$sendLogin = (username, password) => this.sendRequest(username, password);
        window.$mainScreen = mainScreen;


        this.enable();
    }

    sendRequest(nickname, password) {
        if (nickname != '' && password != '') {
            this.connection.send(login.id, login.send_request, nickname, password);
        } else {
            console.log('Please check the nickname and the password!')
        }
    }

    update(delta){
        if (this.input.keyDown.enter && !this.enterPressed) {
            const comp = EZGUI.components;
            this.sendRequest(comp.$nickname.$text, comp.$password.$text);
            this.enterPressed = true;
        }
    }
    
}
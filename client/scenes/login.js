const Scene = require('../core/scene.js'),
      {incoming, outgoing, cogs:{login}} = require('../utils/enums.js');


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
            //this.scenes.village.play();
            //this.disable();
        }
    }
    
}

const cogs = require('../utils/enums.js').cogs;
const ByteArray = require('../../shared/bytearray.js')


module.exports = class preload extends PIXI.Container {
    constructor() {
        super();
        this.name = 'preload';
        this.loaded = false;
    }
    play() {
        let loader = PIXI.loaders.shared;
        loader
        .add("bar_outer", "assets/bar_outer.png")
        .add("bar_inner", "assets/bar_inner.png")
        .load((loader, resources) => {
            const bar_outer = new PIXI.Sprite(resources.$bar_outer.$texture),
                  bar_inner = new PIXI.Sprite(resources.$bar_inner.$texture),
                  x = -bar_outer.$width/2,
                  y = -bar_outer.$height/2,
                  rect = new PIXI.Rectangle(0, 0, 0, bar_inner.$texture.$baseTexture.$height);
            bar_outer.$position.set(x, y);
            this.addChild(bar_outer);
            bar_inner.$position.set(234+x, 100+y);
            bar_inner.$texture.frame = rect;
            this.addChild(bar_inner);
            loader
            .add("character", "assets/character_ske.json")
            .add("character_info", "assets/character_tex.json")
            .add("character_tex", "assets/character_tex.png")
            .add("logo_splash", "assets/splash.png")
            .on("progress", loader => {
                rect.$width = loader.$progress*bar_inner.$texture.$baseTexture.$width/100;
                bar_inner.$texture.frame = rect;
                bar_inner.$texture = bar_inner.$texture;
            })
            .load((loader, resources) => {
                const factory = dragonBones.PixiFactory.factory;
                factory.parseDragonBonesData(resources.$character.$data);
                factory.parseTextureAtlasData(resources.$character_info.$data, resources.$character_tex.$texture);
                this.connection.connect("localhost", 1661);
                const text = new PIXI.Text('Connecting to server ...',{fontFamily : 'Tahoma', fontSize: 24, fill : 0xffffff, align : 'center'});
                text.$position.set(-text.$width/2, 100);
                this.addChild(text);
                this.connection.connect("localhost", 1661);
                this.loaded = true;
            });

            this.connection.use(false, cogs.login.id, (id, packet) => {
                packet.setSpecialByte(id, 3);
            });

            this.connection.packet(false, cogs.login.id, cogs.login.handshake, () => {
                let p = new ByteArray();
                p.writeUInt(1); // version
                p.writeString('&token&'); // TODO: make token system
                p.writeString(navigator.$userAgent); // navigator data
                p.writeString(navigator.$language); // like : fr-TN
                p.writeString(navigator.$platform); // like : win32
                return p;
            });

            this.connection.onopen = () => {
                this.connection.send(cogs.login.id, cogs.login.handshake);
            }
        });
    }
    update() {
        if (this.loaded && this.connection.connected) {
            this.scenes.play('login');
            this.disable();
        }
    }
}
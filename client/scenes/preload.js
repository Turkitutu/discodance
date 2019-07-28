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
                this.loaded = true;
            });
            this.connection.connect("localhost", 1661);
        });
    }
    update() {
        if (this.loaded && this.connection.connected) {
            this.scenes.play('login');
            this.disable();
        }
    }
}
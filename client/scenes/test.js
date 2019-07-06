module.exports = class test extends PIXI.Container {
    constructor() {
        super();
        this.name = 'test';
    }
    play() {
        const resources = PIXI.loaders.shared.resources;
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(resources.character.data);
        factory.parseTextureAtlasData(resources.character_info.data, resources.character_tex.texture);
        const armature = factory.buildArmatureDisplay("body", "character");
        armature.animation.play("breath");
        armature.position.set(200,300);
        armature.scale.set(0.3, 0.3);
        this.addChild(armature);
    }
}
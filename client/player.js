module.exports = class Player {

    constructor(armature, x, y) {
        const resources = PIXI.loaders.shared.resources;
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(resources.character.data);
        factory.parseTextureAtlasData(resources.character_info.data, resources.character_tex.texture);
        this.isMoving = false;
        this.isMovingRight = false;
        this.scale = 0.3;
        this.character = factory.buildArmatureDisplay('body', armature);
        this.character.scale.set(this.scale, this.scale)
        this.character.pivot.set(0, -154)
        this.character.animation.play("breath");
        this.body = Matter.Bodies.rectangle(x, y, 30, 100);
        this.body.frictionStatic = Infinity
        this.body.friction = Infinity
        Matter.Body.setInertia(this.body, Infinity)
    }

    update(){
        this.character.x = this.body.position.x;
        this.character.y = this.body.position.y;
        this.character.rotation = this.body.angle;
        if (this.isMoving){
            if (this.isMovingRight){
                if (this.character.animation.lastAnimationName == "breath"){
                    this.character.animation.fadeIn("run", 0.05);
                }
                let v = {x: 5, y: this.body.velocity.y}
                Matter.Body.setVelocity(this.body, v);
                this.character.scale.set(-this.scale, this.scale);
            }else{
                if (this.character.animation.lastAnimationName == "breath"){
                    this.character.animation.fadeIn("run", 0.05);
                }
                let v = {x: -5, y: this.body.velocity.y}
                Matter.Body.setVelocity(this.body, v);
                this.character.scale.set(this.scale, this.scale)
            }

        }else{
            if (this.isMovingRight){
                if (this.character.animation.lastAnimationName == "run"){
                    this.character.animation.fadeIn("breath", 0.05);
                }
                this.character.scale.set(-this.scale, this.scale)
            }else{
                if (this.character.animation.lastAnimationName == "run"){
                    this.character.animation.fadeIn("breath", 0.05);
                }
                this.character.scale.set(this.scale, this.scale)
            }
        }
    }

}
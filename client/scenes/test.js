var armature;

export default {
    preload() {
        this.load.dragonbone(
            "character",
            "assets/SwordsMan_tex.png",
            "assets/SwordsMan_tex.json",
            "assets/SwordsMan_ske.json"
        );
    },
    create() {
        armature = this.add.armature("Swordsman", "character");
        armature.scale = 0.4;

        armature.animation.play("steady");

        armature.x = this.cameras.main.centerX;
        armature.y = this.cameras.main.centerY + 200;
    },
    update() {
    
    }
};
var armature;

export default {
    preload() {
        this.load.dragonbone(
            "character",
            "assets/test_tex.png",
            "assets/test_tex.json",
            "assets/test_ske.json"
        );
    },
    create() {
        armature = this.add.armature("walk", "character");
        armature.scale = 0.4;

        armature.animation.play();

        armature.x = this.cameras.main.centerX;
        armature.y = this.cameras.main.centerY + 200;
    },
    update() {
    
    }
};
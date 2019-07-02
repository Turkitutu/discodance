var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    plugins: {
        scene: [
            {
                key: 'dragonBones',
                plugin: dragonBones.phaser.plugin.DragonBonesScenePlugin,
                mapping: 'dragonbone'
            }
        ]
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.dragonbone(
        "character",
        "assets/SwordsMan_tex.png",
        "assets/SwordsMan_tex.json",
        "assets/SwordsMan_ske.json"
    );
};

function create () {
    var armatureDisplay = this.add.armature("Swordsman", "character");

    armatureDisplay.animation.play("steady");

    armatureDisplay.scale = 0.4
    armatureDisplay.x = this.cameras.main.centerX;
    armatureDisplay.y = this.cameras.main.centerY + 200;
};

function update () {
};
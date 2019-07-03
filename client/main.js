import testScene from './scenes/test.js';

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
    scene: [ testScene ]
};

var game = new Phaser.Game(config);
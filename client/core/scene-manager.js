const Scene = require('./scene.js');

class SceneManager {
    constructor(app, connection, world, camera, keyboard) {
        Scene.prototype.app = app;
        Scene.prototype.connection = connection;
        Scene.prototype.camera = camera;
        Scene.prototype.input = keyboard;
        Scene.prototype.world = world;
        const scenes = require('../scenes/');
        Scene.prototype.scenes = scenes;
        for (const [SceneName, SceneClass] of Object.entries(scenes)) {
            const scene = new SceneClass();
            scenes[SceneName] = scene;
        }
        scenes.preload.play();
        this.scenes = Object.values(scenes);
    }
    update(delta) {
        for (const scene of this.scenes) {
            if (scene.$visible && scene.update) scene.update(delta);
        }
    }
}

module.exports = SceneManager;
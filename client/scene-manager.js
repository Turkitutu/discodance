const Container = PIXI.Container;

class SceneManager {
    constructor(app, world, camera, keyboard) {
        this.get = {};
        this.sceneList = [];
        Container.prototype.app = app;
        Container.prototype.camera = camera;
        Container.prototype.input = keyboard;
        Container.prototype.world = world;
        Container.prototype.scenes = this;
        const req = require.context('./scenes', false, /\.js$/);
        for (const filename of req.keys()) {
            const Scene = req(filename),
                  scene = new Scene();
            scene.visible = false;
            this.get[scene.name] = scene;
            this.sceneList.push(scene);
            scene.scenes = this;
            app.stage.addChild(scene);
        }
    }
    disable() {
        for (const scene of this.sceneList) {
            if (scene.visible) scene.disable();
        }
    }
    play(sceneName, ignoreCamera) {
        const scene = this.get[sceneName];
        if (!ignoreCamera) scene.camera.target(scene);
        if (scene.play) scene.play();
        scene.visible = true;
    }
    update(delta) {
        for (const scene of this.sceneList) {
            if (scene.visible && scene.update) scene.update(delta);
        }
    }
}

Container.prototype.disable = function() {
    this.visible = false;
}

module.exports = SceneManager;
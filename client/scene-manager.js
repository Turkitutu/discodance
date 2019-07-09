const Container = PIXI.Container;

class SceneManager {
    constructor(app, camera, keyboard) {
        this.get = {};
        this.current = [];
        Container.prototype.app = app;
        Container.prototype.camera = camera;
        Container.prototype.input = keyboard;
        const req = require.context('./scenes', false, /\.js$/);
        for (const filename of req.keys()) {
            const Scene = req(filename),
                  scene = new Scene();
            scene.visible = false;
            this.get[scene.name] = scene;
            scene.scenes = this;
            app.stage.addChild(scene);
        }
    }
    disable(sceneName) {
        if (sceneName) {
            const scene = this.get[sceneName];
            scene.visible = false;
            this.current.splice(this.current.indexOf(scene), 1);
        } else {
            for (const scene of this.current)
                scene.visible = false;
            this.current = [];
        }
    }
    play(sceneName, ignoreCamera) {
        const scene = this.get[sceneName];
        this.current.push(scene);
        if (scene.play) scene.play();
        if (!ignoreCamera) scene.camera.target(scene);
        scene.visible = true;
    }
    update(delta) {
        for (const scene of this.current) {
            if (scene.update) scene.update(delta);
        }
    }
}

Container.prototype.disable = function() {
    this.scenes.disable(this.name);
}
Container.prototype.scenes = SceneManager;

module.exports = SceneManager;
function disable() {
    this.scenes.disable(this.name);
}
module.exports = {
    get: {},
    current: [],
    initiate(app) {
        this.app = app;
        const req = require.context('./scenes', false, /\.js$/);
        for (const filename of req.keys()) {
            const Scene = req(filename),
                  scene = new Scene();
            scene.visible = false;
            this.get[scene.name] = scene;
            scene.scenes = this;
            scene.disable = disable;
            app.stage.addChild(scene);
        }
    },
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
    },
    play(sceneName) {
        const scene = this.get[sceneName];
        this.current.push(scene);
        if (scene.play) scene.play();
        scene.visible = true;
    },
    update(delta) {
        for (const scene of this.current) {
            if (scene.update) scene.update(delta);
        }
    }
}
const SceneManager = require('./scene-manager.js'),
      Camera = require('./camera.js'),
      Keyboard = require('./keyboard.js'),
      World = require('./physics/world.js'),
      keysDefault = require('./utils/keys-default.js');

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
    resolution: window.devicePixelRatio || 1
});

app.width = 2560;
app.height = 1440;
Camera.handleResize(app);

window.onload = () => {
    app.view.style.display = 'block';
    document.body.appendChild(app.view);
}

const world = new World({
    gravity: {
        x: 0,
        y: 3
    },
    debug: true
});

const camera = new Camera(app);

const keyboard = new Keyboard();
keyboard.batchRegister(keysDefault);

const sceneManager = new SceneManager(app, world, camera, keyboard);

sceneManager.play('preload');

app.ticker.add(delta => {
    sceneManager.update(delta);
    camera.update();
    //last thing
    keyboard.update();
});
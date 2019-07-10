const SceneManager = require('./scene-manager.js'),
      Camera = require('./camera.js'),
      Keyboard = require('./keyboard.js'),
      keysDefault = require('./utils/keys-default.js');

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
    resolution: window.devicePixelRatio || 1
});

const resize = () => {
    let width = window.innerWidth,
        height = window.innerHeight,
        baseHeight = width/app.ratio,
        position = app.stage.position;
    app.renderer.resize(width, height);
    if (height >= baseHeight) {
        position.set(0, (height-baseHeight)/2);
        height = baseHeight;
    } else {
        let baseWidth = height*app.ratio;
        position.set((width-baseWidth)/2, 0);
        width = baseWidth;
    }
    app.stage.scale.set(width/app.width, height/app.height);
}

app.width = 2560;
app.height = 1440;
app.ratio = app.width/app.height;

window.addEventListener('resize', resize);
resize();

window.onload = () => {
    app.view.style.display = 'block';
    document.body.appendChild(app.view);
}

const keyboard = new Keyboard();
keyboard.batchRegister(keysDefault);

const camera = new Camera(app.width/2, app.height/2);

const sceneManager = new SceneManager(app, camera, keyboard);

sceneManager.play('preload');

app.ticker.add(delta => {
    sceneManager.update(delta);

    //last thing
    keyboard.update();
});
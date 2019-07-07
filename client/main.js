const SceneManager = require('./scene-manager.js'),
      Camera = require('./camera.js'),
      Keyboard = require('./keyboard.js');

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
    resolution: window.devicePixelRatio || 1
});

app.width = app.screen.width;
app.height = app.screen.height;
app.ratio = app.height/app.width;

window.addEventListener('resize', () => {
    const width = window.innerWidth,
          height = window.innerHeight,
          baseHeight = width*app.ratio;
    app.renderer.resize(width, height);
    app.stage.scale.set(width/app.width, baseHeight/app.height);
    if (height > baseHeight) {
        app.stage.position.y = (height-baseHeight)/2
    }
});

window.onload = () => {
    app.view.style.display = 'block';
    document.body.appendChild(app.view);
}

const keyboard = new Keyboard();

const camera = new Camera(app.width/2, app.height/2);

const sceneManager = new SceneManager(app, camera, keyboard);

sceneManager.play('preload');

app.ticker.add(delta => {
    sceneManager.update(delta);
});
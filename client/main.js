const sceneManager = require('./scene-manager.js');

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

window.onload = function() {
    app.view.style.display = 'block';
    document.body.appendChild(app.view);
}

sceneManager.initiate(app);

sceneManager.play('preload');

app.ticker.add(delta => {
    sceneManager.update(delta);
});
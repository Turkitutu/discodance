require('../libs/others.ref.js');
window.PIXI = require('../libs/pixi.ref.js');
window.Matter = require('../libs/matter.ref.js');
window.dragonBones = require('../libs/dragonbones.ref.js');

const { 
        SceneManager,
        Camera,
        Keyboard,
        Connection
    } = require('./core/'),
    World = require('./physics/world.js'),
    keysDefault = require('./utils/keys-default.js');

const app = new PIXI.Application({
    $width: window.$innerWidth,
    $height: window.$innerHeight,
    $autoResize: true,
    $resolution: window.$devicePixelRatio || 1
});

app.width = 2560;
app.height = 1440;
Camera.handleResize(app);

window.$onload = () => {
    document.$body.$style.$overflow = 'hidden'
    app.view.$style.$position = 'absolute';
    app.view.$style.$display = 'block';
    document.$body.$appendChild(app.$view);
}

const world = new World({
    $gravity: {
        $x: 0,
        $y: 3
    },
    debug: true
});

const connection = new Connection();

const camera = new Camera(app);

const keyboard = new Keyboard();
keyboard.batchRegister(keysDefault);

const sceneManager = new SceneManager(app, connection, world, camera, keyboard);

app.ticker.add(delta => {
    sceneManager.update(delta);
    camera.update();
    //last thing
    keyboard.update();
});
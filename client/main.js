require('../libs/others.ref.js');
window.box2d = require('../libs/box2d.ref.js')
window.PIXI = require('../libs/pixi.ref.js');
window.dragonBones = require('../libs/dragonbones.ref.js');
window.EZGUI = require('../libs/ezgui.ref.js');

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
    $antialias: true,
    $resolution: window.$devicePixelRatio || 1
});

var accumulator = 0;

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
    gravity: 10,
    debug: true
});

const connection = new Connection();

const camera = new Camera(app);

const keyboard = new Keyboard();
keyboard.batchRegister(keysDefault);

const sceneManager = new SceneManager(app, connection, world, camera, keyboard);

app.ticker.add(delta => {
    accumulator += Math.min(delta, 15);
    while (accumulator >= 1) {
        sceneManager.update();
        camera.update();
        
        //last thing
        keyboard.update();

        accumulator -= 1;
    }
});
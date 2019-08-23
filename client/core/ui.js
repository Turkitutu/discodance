function fileNamesFor(category) {
    return {
        //tilingSprites: {
        left: category+'-left.png',
        right: category+'-right.png',
        top: category+'-top.png',
        bottom: category+'-bottom.png',
        center: category+'-center.png',
        //}
        //sprites: {
        topLeft: category+'-top-left.png',
        topRight: category+'-top-right.png',
        bottomLeft: category+'-bottom-left.png',
        bootomRight: category+'-bottom-right.png'
        //}
    }
}

const theme = {
    window: fileNamesFor('window')
}
const resources = PIXI.loaders.shared.resources;

class Theme {
    constructor(name) {
        const textures = resources[name].textures;
        for (const category in theme) {
            if (textures[theme[category].center]) {
                this[category] = {};
                for (const side of theme[category]) {
                    this[category][side] = textures[theme[category][side]];
                }
            }
        }
    }
}

const themes = {};

class Component extends PIXI.Container {
    constructor(textures, options) {
        super();
        //this.theme = options.theme;
        //this.size = options.size;
        //build sprite;
        if (options.position) {
            this.$position.set(options.position[0], options.position[1]);
        }
    }
}

class Window extends Component {
    constructor(options) {
        super((options.theme || themes.default).window, options);
    }
}

module.exports = {
    themes,
    Component,
    Window
};
class Scene extends PIXI.Container {
    constructor() {
        super();
        this.$visible = false;
        this.app.$stage.addChild(this);
        this.camera.center(this);
    }
    enable() {
        this.$visible = true;
    }
    disable() {
        this.$visible = false;
    }
}

module.exports = Scene;
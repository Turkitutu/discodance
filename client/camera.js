function barycenter(objects) {
    const point = new PIXI.Point(0, 0);
    const length = 0;
    for (const obj of objects) {
        length++;
        point.x += obj.position.x;
        point.y += obj.position.y;
    }
    point.x /= length;
    point.y /= length;
    return point;
}
module.exports = class Camera {
    constructor(origX, origY, speed, tolerance) {
        this.speed = speed || 0.1; //interval [0, 1]
        this.tolerance = tolerance || 5;
        this.origin = new PIXI.Point(origX, origY);
        this._position = new PIXI.Point();
    }
    reset() {
        this._focus = null;
        if (this._target) {
            this.zoom(1);
            this.teleport(this.origin.x, this.origin.y);
        } else {
            this._scale = 1;
            this._position.set(this.origin.x, this.origin.y);
        }
    }
    target(scene) {
        this._target = scene;
        this.reset();
    }
    focus(children) {
        //children: array
        this._focus = children;
    }
    zoom(scale) {
        this._scale = scale;
        this._target.scale.set(scale, scale);
    }
    teleport(x, y) {
        this._position.set(x, y);
        this._target.position.set(x, y);
    }
    translate(x, y) {
        this._target.position.x += x;
        this._target.position.y += y;
        this._position.x += x;
        this._position.y += y;
    }
    update(delta) {
        if (this._focus) {
            const bc = barycenter(this._focus),
                  posX = (bc.x-this._target.position.x)*this.speed,
                  posY = (bc.y-this._target.position.y)*this.speed;
            this.translate(posX > this.tolerance ? posX : 0, posY > this.tolerance ? posY : 0);
            let dx = 0, dy = 0;
            for (const target of this._focus) {
                dx = Math.max(dx, Math.abs(bc.x-target.position.x)+target.width/2);
                dy = Math.max(dy, Math.abs(bc.y-target.position.y)+target.height/2);
            }
            const app = this._target.scenes.app,
                  zoom = (dx/app.ratio > dy ? app.width/dx : app.height/dy)*this._scale;
            this._target.scale.set(zoom, zoom)
        }
    }
}
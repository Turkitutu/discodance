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
    constructor(target) {
        this.target = target;
    }
    focus(children) {
        //children: array
        this._focus = children;
    }
    zoom(scale) {

    }
    move(position) {
        this.position.copy(position);
    }
    update(delta) {
        if (this._focus) {
            const bc = barycenter(this._focus);
            this.move(bc);
            let dx = 0, dy = 0;
            for (const target of this._focus) {
                dx = Math.max(dx, Math.abs(bc.x-target.position.x));
                dy = Math.max(dy, Math.abs(bc.y-target.position.y));
            }
        }
    }
}
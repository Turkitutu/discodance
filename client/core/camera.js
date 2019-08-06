module.exports = class Camera {
    constructor(app, speed, tolerance) {
        this.app = app;
        this.speed = speed || 0.1; //interval [0, 1]
        this.tolerance = tolerance || 1;
        this.container = new PIXI.Container();
        app.$stage.addChild(this.container);
        this.container.$position.set(app.width/2, app.height/2);
        this.bounds = new PIXI.Point(Infinity, Infinity);
        this._barycenter = new PIXI.Point();
    }
    reset() {
        this._focus = null;
        if (this._target) {
            this.zoom(1);
            this.teleport(0, 0);
        } else {
            this._scale = 1;
        }
    }
    center(scene) {
        scene.$position.set(this.app.width/2, this.app.height/2);
    }
    target(scene) {
        if (this._target) {
            this.app.$stage.addChild(this._target);
            this.center(this._target);
        }
        this._target = scene;
        this.container.addChild(scene);
        this.reset();
    }
    focus(children) {
        this._focus = children;
    }
    zoom(scale) {
        this._scale = scale;
        this.container.$scale.set(scale, scale);
    }
    teleport(x, y) {
        this._target.$position.set(-x, -y);
    }
    translate(x, y) {
        this._target.$position.$x -= x;
        this._target.$position.$y -= y;
    }
    barycenter() {
        this._barycenter.set(0, 0);
        let length = 0;
        for (const obj of this._focus) {
            length++;
            const position = obj.body.GetPosition();
            this._barycenter.$x += position.x*100;
            this._barycenter.$y += position.y*100;
        }
        this._barycenter.$x /= length;
        this._barycenter.$y /= length;
        return this._barycenter;
    }
    update(delta) {
        if (this._focus) {
            const bc = this.barycenter(),
                  posX = bc.$x+this._target.$position.$x,
                  posY = bc.$y+this._target.$position.$y;
            this.translate(Math.abs(posX) > this.tolerance ? posX*this.speed : posX, Math.abs(posY) > this.tolerance ? posY*this.speed : posY);
            let dx = 0, dy = 0;
            for (const target of this._focus) {
                const position = target.body.GetPosition();
                dx = Math.max(dx, Math.abs(bc.$x-position.x*100)+target.width/2);
                dy = Math.max(dy, Math.abs(bc.$y-position.y*100)+target.height/2);
            }
            const zoom = dx/this.app.fullRatio > dy ? this.app.fullWidth*this._scale/(dx*4) : this.app.fullHeight*this._scale/(dy*4);
            this.container.$scale.set(zoom);
        }
    }
    static handleResize(app, components) {
        const resize = () => {
            let width = window.$innerWidth,
                height = window.$innerHeight,
                baseHeight = width/app.ratio,
                scale = 1,
                position = app.$stage.$position;
            app.$renderer.$resize(width, height);
            app.fullRatio = width/height;
            if (height >= baseHeight) {
                position.set(0, (height-baseHeight)/2);
                scale = width/app.width;
                app.fullWidth = app.width;
                app.fullHeight = app.width/app.fullRatio;
            } else {
                position.set((width-height*app.ratio)/2, 0);
                scale = height/app.height;
                app.fullWidth = app.height*app.fullRatio;
                app.fullHeight = app.height;
            }
            for (const component of components) {
                if (component.$visible && component.dom) {
                    component.update();
                }
            }
            app.$stage.$scale.set(scale, scale);
        }

        app.ratio = app.width/app.height;

        window.$addEventListener('resize', resize);
        resize();
    }
}
class DebugDraw extends box2d.b2Draw {
    constructor() {
        super();
        this.renderer = new PIXI.Graphics();
        this.vec = new PIXI.Point();
        this.origin = new PIXI.Point();
        this.cosa = 1;
        this.sina = 0;
        this._save = [];
        this.SetFlags(box2d.b2DrawFlags.e_shapeBit);
    }
    transform(x, y) {
        this.vec.$x = this.origin.$x + (x * this.cosa + y * this.sina);
        this.vec.$y = this.origin.$y + (-x * this.sina + y * this.cosa);
    }
    moveTo(x, y) {
        this.transform(x, y);
        this.renderer.moveTo(this.vec.$x, this.vec.$y);
    }
    lineTo(x, y) {
        this.transform(x, y);
        this.renderer.lineTo(this.vec.$x, this.vec.$y);
    }
    translate(x, y) {
        this.origin.$x = x;
        this.origin.$y = y;
    }
    rotate(angle) {
        this.cosa = Math.cos(-angle);
        this.sina = Math.sin(-angle);
    }
    clear() {
        this._save = [];
        this.renderer.clear();
    }
    restore() {
        const data = this._save.pop() || [new PIXI.Point(), 0];
        this.translate(data[0].$x, data[0].$y);
        this.rotate(data[1]);
    }
    toDec(color) {
        return ((color.$r * 255) << 16) | ((color.$g * 255) << 8) | (color.$b * 255);
    }
    $PushTransform(xf) {
        this._save.push([this.origin.clone(), this.angle]);
        this.translate(xf.$p.$x, xf.$p.$y);
        this.rotate(xf.$q.GetAngle());
    }
    $PopTransform(xf) {
        this.restore();
    }
    $DrawPolygon(vertices, vertexCount, color) {
        this.renderer.lineStyle(0.03, this.toDec(color)); 
        this.moveTo(vertices[0].$x, vertices[0].$y);
        for (let i = 1; i < vertexCount; i++) {
            this.lineTo(vertices[i].$x, vertices[i].$y);
        }
        this.renderer.closePath();
    }
    $DrawSolidPolygon(vertices, vertexCount, color) {
        color =  this.toDec(color);
        this.renderer.beginFill(color, 0.5);
        this.renderer.lineStyle(0.03, color); 
        this.moveTo(vertices[0].$x, vertices[0].$y);
        for (let i = 1; i < vertexCount; i++) {
            this.lineTo(vertices[i].$x, vertices[i].$y);
        }
        this.renderer.closePath();
        this.renderer.endFill();
    }
    $DrawCircle(center, radius, color) {
        this.renderer.lineStyle(0.03, this.toDec(color));
        this.renderer.drawCircle(center.$x, center.$y, radius);
    }
    $DrawSolidCircle(center, radius, axis, color) {
        const cx = center.$x;
        const cy = center.$y;
        color = this.toDec(color);
        this.renderer.beginFill(color, 0.5);
        this.renderer.lineStyle(0.03, color);
        this.renderer.drawCircle(cx, cy, radius);
        this.renderer.endFill();
        this.moveTo(cx, cy);
        this.lineTo((cx + axis.$x * radius), (cy + axis.$y * radius));
    }
    $DrawParticles(centers, radius, colors, count) {
        if (colors !== null) {
            for (let i = 0; i < count; ++i) {
                const center = centers[i];
                const color = this.toDec(colors[i]);
                this.renderer.beginFill(color, color.a);
                this.renderer.drawCircle(center.$x, center.$y, radius);
                this.renderer.endFill();
            }
        }
        else {
            for (let i = 0; i < count; ++i) {
                const center = centers[i];
                this.renderer.beginFill(0xffffff, 0.5);
                this.renderer.drawCircle(center.$x, center.$y, radius);
                this.renderer.endFill();
            }
        }
    }
    $DrawSegment(p1, p2, color) {
        this.renderer.lineStyle(0.03, this.toDec(color));
        this.moveTo(p1.$x, p1.$y);
        this.lineTo(p2.$x, p2.$y);
    }
    $DrawTransform(xf) {
        this.$PushTransform(xf);
        this.renderer.lineStyle(0.03, 0xff0000);
        this.moveTo(0, 0);
        this.lineTo(1, 0);
        this.renderer.lineStyle(0.03, 0x00ff00);
        this.moveTo(0, 0);
        this.lineTo(0, 1);
        this.$PopTransform(xf);
    }
    $DrawPoint(p, size, color) {
        this.renderer.beginFill(this.toDec(color), color.a);
        const hsize = size / 2;
        this.renderer.drawRect(p.$x - hsize, p.$y - hsize, size, size);
        this.renderer.endFill();
    }
    $DrawAABB(aabb, color) {
        this.renderer.lineStyle(0.03, this.toDec(color), color.a);
        const x = aabb.$lowerBound.$x;
        const y = aabb.$lowerBound.$y;
        const w = aabb.$upperBound.$x - aabb.$lowerBound.$x;
        const h = aabb.$upperBound.$y - aabb.$lowerBound.$y;
        this.transform(x, y);
        this.renderer.drawRect(this.vec.$x, this.vec.$y, w, h);
    }
};

module.exports = DebugDraw;
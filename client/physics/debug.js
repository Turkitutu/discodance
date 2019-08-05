class DebugDraw extends box2d.b2Draw {
    constructor(ctx) {
        super();
        this.m_ctx = new PIXI.Graphics();
        this.renderer = this.m_ctx;
        this._save = [];
        this.SetFlags(box2d.b2DrawFlags.e_shapeBit);
    }
    clear() {
        this._save = [];
        for (const child of this.renderer.$children) {
            child.destroy(true);
        }
        this.renderer.clear();
    }
    transform(tx, ty, r) {
        this.m_ctx = new PIXI.Graphics();
        this.renderer.addChild(this.m_ctx);
        this.m_ctx.$position.$x += tx;
        this.m_ctx.$position.$y += ty;
        this.m_ctx.$rotation += r;
    }
    restore() {
        this.m_ctx = this._save.pop() || this.renderer;
    }
    toDec(color) {
        return ((color.$r * 255) << 16) | ((color.$g * 255) << 8) | (color.$b * 255);
    }
    $PushTransform(xf) {
        this._save.push(this.m_ctx);
        this.transform(xf.$p.$x, xf.$p.$y, xf.$q.GetAngle());
    }
    $PopTransform(xf) {
        this.restore();
    }
    $DrawPolygon(vertices, vertexCount, color) {
        this.m_ctx.lineStyle(0.03, this.toDec(color)); 
        this.m_ctx.moveTo(vertices[0].$x, vertices[0].$y);
        for (let i = 1; i < vertexCount; i++) {
            this.m_ctx.lineTo(vertices[i].$x, vertices[i].$y);
        }
        this.m_ctx.closePath();
    }
    $DrawSolidPolygon(vertices, vertexCount, color) {
        color =  this.toDec(color);
        this.m_ctx.beginFill(color, 0.5);
        this.m_ctx.lineStyle(0.03, color); 
        this.m_ctx.moveTo(vertices[0].$x, vertices[0].$y);
        for (let i = 1; i < vertexCount; i++) {
            this.m_ctx.lineTo(vertices[i].$x, vertices[i].$y);
        }
        this.m_ctx.closePath();
        this.m_ctx.endFill();
    }
    $DrawCircle(center, radius, color) {
        this.m_ctx.lineStyle(0.03, this.toDec(color));
        this.m_ctx.drawCircle(center.$x, center.$y, radius);
    }
    $DrawSolidCircle(center, radius, axis, color) {
        const cx = center.$x;
        const cy = center.$y;
        color = this.toDec(color);
        this.m_ctx.beginFill(color, 0.5);
        this.m_ctx.lineStyle(0.03, color);
        this.m_ctx.drawCircle(cx, cy, radius);
        this.m_ctx.endFill();
        this.m_ctx.moveTo(cx, cy);
        this.m_ctx.lineTo((cx + axis.$x * radius), (cy + axis.$y * radius));
    }
    $DrawParticles(centers, radius, colors, count) {
        if (colors !== null) {
            for (let i = 0; i < count; ++i) {
                const center = centers[i];
                const color = this.toDec(colors[i]);
                this.m_ctx.beginFill(color, color.a);
                this.m_ctx.drawCircle(center.$x, center.$y, radius);
                this.m_ctx.endFill();
            }
        }
        else {
            for (let i = 0; i < count; ++i) {
                const center = centers[i];
                this.m_ctx.beginFill(0xffffff, 0.5);
                this.m_ctx.drawCircle(center.$x, center.$y, radius);
                this.m_ctx.endFill();
            }
        }
    }
    $DrawSegment(p1, p2, color) {
        this.m_ctx.lineStyle(0.03, this.toDec(color));
        this.m_ctx.moveTo(p1.$x, p1.$y);
        this.m_ctx.lineTo(p2.$x, p2.$y);
    }
    $DrawTransform(xf) {
        this.$PushTransform(xf);
        this.m_ctx.lineStyle(0.03, 0xff0000);
        this.m_ctx.moveTo(0, 0);
        this.m_ctx.lineTo(1, 0);
        this.m_ctx.lineStyle(0.03, 0x00ff00);
        this.m_ctx.moveTo(0, 0);
        this.m_ctx.lineTo(0, 1);
        this.$PopTransform(xf);
    }
    $DrawPoint(p, size, color) {
        this.m_ctx.beginFill(this.toDec(color), color.a);
        const hsize = size / 0.03;
        this.m_ctx.drawRect(p.$x - hsize, p.$y - hsize, size, size);
        this.m_ctx.endFill();
    }
    $DrawAABB(aabb, color) {
        this.m_ctx.lineStyle(0.03, this.toDec(color), color.a);
        const x = aabb.$lowerBound.$x;
        const y = aabb.$lowerBound.$y;
        const w = aabb.$upperBound.$x - aabb.$lowerBound.$x;
        const h = aabb.$upperBound.$y - aabb.$lowerBound.$y;
        this.m_ctx.drawRect(x, y, w, h);
    }
};

module.exports = DebugDraw;
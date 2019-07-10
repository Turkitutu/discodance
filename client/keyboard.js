class Keyboard {
    constructor() {
        this._regist = {};
        this.keyDown = {};
        this.wasModified = {};
        this.preventDefault = true;
        window.addEventListener("keydown", e => {
            if (this.preventDefault)
                e.preventDefault();
            const key = this._regist[e.keyCode || e.charCode];
            if (key) {
                if (!this.keyDown[key.name])
                    this.wasModified[key.name] = true;
                this.keyDown[key.name] = 2;
                if (key.opposite && this.keyDown[key.opposite]) {
                    this.keyDown[key.opposite] = 1;
                }
            }
        })
        window.addEventListener("keyup", e => {
            if (this.preventDefault)
                e.preventDefault();
            const key = this._regist[e.keyCode || e.charCode];
            if (key) {
                if (this.keyDown[key.name])
                    this.wasModified[key.name] = true;
                this.keyDown[key.name] = 0;
            }
        })
    }
    registerKey(keyCode, key) {
        this._regist[keyCode] = key;
        this.keyDown[key.name] = 0;
        if (key.aliases) {
            for (const alias of key.aliases) {
                this._regist[alias] = key;
            }
        }
    }
    batchRegister(keys) {
        for (const key of keys) {
            this.registerKey(key.keyCode, key);
        }
    }
    update() {
        this.wasModified = {};
    }
}

module.exports = Keyboard;
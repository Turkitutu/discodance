class Keyboard {
    constructor() {
        this._regist = {};
        this.keyDown = {};
        this.wasModified = {};
        this.preventDefault = true;
        window.$addEventListener("keydown", e => {
            if (this.preventDefault)
                e.$preventDefault();
            const key = this._regist[e.$keyCode || e.$charCode];
            if (key) {
                if (!this.keyDown[key.ref])
                    this.wasModified[key.ref] = true;
                this.keyDown[key.ref] = 2;
                if (key.opposite && this.keyDown[key.opposite.ref]) {
                    this.keyDown[key.opposite.ref] = 1;
                }
            }
        })
        window.$addEventListener("keyup", e => {
            if (this.preventDefault)
                e.$preventDefault();
            const key = this._regist[e.$keyCode || e.$charCode];
            if (key) {
                if (this.keyDown[key.ref])
                    this.wasModified[key.ref] = true;
                this.keyDown[key.ref] = 0;
            }
        })
    }
    registerKey(key) {
        this._regist[key.keyCode] = key;
        this.keyDown[key.ref] = 0;
        if (key.aliases) {
            for (const alias of key.aliases) {
                this._regist[alias] = key;
            }
        }
    }
    batchRegister(keys) {
        for (const key of Object.$keys(keys)) {
            keys[key].ref = key;
            this.registerKey(keys[key]);
        }
    }
    update() {
        this.wasModified = {};
    }
}

module.exports = Keyboard;
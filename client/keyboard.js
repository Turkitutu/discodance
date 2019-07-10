class Keyboard {
    constructor() {
        this._regist = {};
        this.keyDown = {};
        this.preventDefault = true;
        window.addEventListener("keydown", e => {
            if (this.preventDefault)
                e.preventDefault();
            const key = this._regist[e.keyCode || e.charCode];
            if (key) {
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
                this.keyDown[key.name] = 0;
            }
        })
    }
    registerKey(keyCode, key) {
        this._regist[keyCode] = key;
        this.keyDown[key.name] = 0;
    }
    batchRegister(keys) {
        for (const key of keys) {
            this.registerKey(key.keyCode, key);
        }
    }
}

module.exports = Keyboard;
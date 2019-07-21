class Emitter {
    constructor() {
        this._events = {};
    }
    on(eventName, cb) {
        if (!this._events[eventName]) {
            this._events[eventName] = [cb];
        } else {
            this._events[eventName].push(cb);
        }
        return this;
    }
    off(eventName, cb) {
        if (this._events[eventName]) {
            const index = this._events[eventName].indexOf(cb);
            if (index !== -1) this._events[eventName].slice(index, 1);
        }
        return this;
    }
    once(eventName, cb) {
        const cb2 = (...args) => {
            this.off(eventName, cb2);
            cb(...args);
        }
        this.on(eventName, cb2);
        return this;
    }
    emit(eventName, ...args) {
        if (this._events[eventName]) {
            for (const event of this._events[eventName]) {
                event(...args);
            }
        }
        return this;
    }
}

module.exports = Emitter;

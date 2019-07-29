const ByteArray = require("../../shared/bytearray.js");

class Packet {
    constructor(message, player) {
        this.player = player;
        this.read(message);
    }
    setData(byteArray) {
        this.data = byteArray;
        this.writeCog();
    }
    setCog(id) {
        this.cogId = id;
        this.writeCog();
    }
    writeCog() {
        const offset = this.data.writeOffset || 1;
        this.data.writeOffset = 0;
        this.data.writeUInt(this.cogId);
        this.data.writeOffset = offset;
    }
    read(message) {
        this.data = new ByteArray(message);
        this.cogId = this.data.readUInt();
    }
    send() {
        this.player.socket.send(this.data);
    }
    broadcast() {
        for (const player of this.player.server.players) {
            player.socket.send(this.data);
        }
    }
}

module.exports = Packet;
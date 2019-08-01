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
        const offset = this.data.writeOffset || 2;
        this.data.writeOffset = 1;
        this.data.writeUInt(this.cogId);
        this.data.writeOffset = offset;
    }
    read(message) {
        this.data = new ByteArray(message);
        this.cogId = this.data.readUInt();
    }
    send() {
        this.player.socket.send(this.data.buffer);
    }
    broadcast(type) {
        const buffer = this.data.buffer;
        switch (type) {
            case 'ALL': 
                for (const player of this.player.server.players) {
                    player.socket.send(buffer);
                }
                break;
            case 'ROOM':
                for (const player of this.player.room.players) {
                    player.socket.send(buffer);
                }
                break;
        }
    }
}

module.exports = Packet;
const ByteArray = require("../../shared/bytearray.js");

class Packet {
    constructor(player, message) {
        this.player = player;
        if (message){
            this.read(message);
        }else{
            this.data = new ByteArray();
        }
    }
    setData(byteArray) {
        this.data = byteArray;
        this.writeCog();
    }
    setCog(id) {
        this.cogId = id;
        this.writeCog();
        return this
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
        this.player.socket.send(this.data.buffer);
    }
    broadcast(type) {
        const buffer = this.data.buffer;
        var players;
        switch (type) {
            case 'ALL': 
                players = this.player.server.players;
                for (const id of Object.keys(players)) {
                    players[id].socket.send(buffer);
                }
                break;
            case 'ROOM':
                players = this.player.room.players;
                for (const id of Object.keys(players)) {
                    players[id].socket.send(buffer);
                }
                break;
            case 'ROOM_OTHERS':
                players = this.player.room.players;
                for (const id of Object.keys(players)) {
                    if (players[id].id != this.player.id) players[id].socket.send(buffer);
                }
                break;
        }
    }
}

module.exports = Packet;
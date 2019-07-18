const ByteArray = require("../../shared/bytearray.js");

class Packet {
    constructor(message, ws) {
        this.socket = ws;
        this.read(message);
        //this.cogId, this.socket (ws), this.data (byteArray from message);
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
        this.socket.send(this.data);
    }
    broadcast() {
        //for each client: client.send(this.data);
    }
}
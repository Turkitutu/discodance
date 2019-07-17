class Cog {
    constructor(name) {
        this.name = name;
        this.incoming = require("../"+name+"/incoming");
        this.outgoing = require("../"+name+"/outgoing");
    }
    read(packet) {
        return this.incoming[packet.data.readUInt()]; //return packetName;
    }
    write(packetName, packet) {
        packet.data.writeOffset = 1;
        packet.data.writeUInt(this.outgoing[packetName]);
    }
}

module.exports = Cog;
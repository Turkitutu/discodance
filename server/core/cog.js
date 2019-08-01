class Cog {
    constructor(name) {
        this.incoming = require("../"+name+"/incoming");
        this.outgoing = require("../"+name+"/outgoing");
    }
    read(packet) {
        //this is the default read function
        //the default is to read packet_id at offset 1;
        return this.incoming[packet.data.getSpecialByte(1)]; //return packetName;
    }
    write(packetName, packet) {
        //this is the default write function
        //the default is to write packet_id at offset 1;
        packet.data.setSpecialByte(this.outgoing[packetName], 1);
    }
}

module.exports = Cog;
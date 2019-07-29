const Cog = require("../core/cog");

class Community extends Cog {
    constructor(name) {
        super(name);
    }
    read(packet) {
        //this is a special read function, it replaces the default function.
        //this special function read packet_id at offset 3;
        return this.incoming[packet.data.getSpecialByte(3)]; //return packetName;
    }
    //if you don't define a write or a read function, the default one is used.
    send_room_message(packet) {
        //this is a recieved packet;
        do_something(packet);
    }
    do_something(packet) {
        //do something with packet and send it!!!
    }
}

module.exports = Community;
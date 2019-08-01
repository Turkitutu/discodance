const Cog = require("../core/cog"),
      ByteArray = require("../../shared/bytearray");

class Community extends Cog {
    constructor(name) {
        super(name);
    }
    read(packet) {
        //this is a special read function, it replaces the default function.
        //this special function read packet_id at offset 3;
        console.log(packet.data.getSpecialByte(3));
        return this.incoming[packet.data.getSpecialByte(3)]; //return packetName;
    }
    //if you don't define a write or a read function, the default one is used.
    on_room_message(packet) {
        const [message, length] = packet.data.readString();
        console.log(message, length);
        if (length > 255) {
            //This packet is not sent by the browser.
            //Probably warn / ban;
        }
        this.send_room_message(packet, message);
    }
    send_room_message(packet, message) {
        packet.setData(new ByteArray()); //set packet's buffer to a new buffer.
        this.write('send_room_message', packet); //write packet id the new buffer.

        packet.data.writeString(message);
        console.log(packet.data.data.toString());
        packet.broadcast('ROOM');
    }
}

module.exports = Community;
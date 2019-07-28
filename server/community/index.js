const Cog = require("../core/cog");

class Community extends Cog {
    constructor(name, player) {
        super(name);
        super(player);
    }
    send_room_message(packet) {
        //this is a recieved packet;
        do_something(packet);
    }
    do_something(packet) {
        //do something with packet and send it!!!
    }
}

module.exports = Community;
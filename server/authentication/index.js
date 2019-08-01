const Cog = require("../core/cog");

class Authentication extends Cog {
    constructor(name) {
        super(name);
    }
    read(packet) {
        return this.incoming[packet.data.getSpecialByte(3)];
    }

    handshake(packet) {
        let version = packet.data.readUInt(),
            [token] = packet.data.readString();
        packet.player.userAgent = packet.data.readString()[0];
        packet.player.language = packet.data.readString()[0];
        packet.player.platform = packet.data.readString()[0];
        //TODO: check the token and version
    }

}

module.exports = Authentication;
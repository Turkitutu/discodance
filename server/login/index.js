const Cog = require("../core/cog");

class Login extends Cog {
    constructor(name) {
        super(name);
    }
    read(packet) {
        return this.incoming[packet.data.getSpecialByte(3)];
    }

    handshake(packet) {
        let version = packet.data.readUInt(),
            token = packet.data.readString();
        packet.player.userAgent = packet.data.readString();
        packet.player.language = packet.data.readString();
        packet.player.platform = packet.data.readString();
        //TODO: check the token and version
    }

}

module.exports = Login;
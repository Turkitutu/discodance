const Cog = require('../core/cog.js'),
      ByteArray = require('../../shared/bytearray.js');

const errors = {
    invalid: 0,
    areadyConnected: 1,
}

class Login extends Cog {
    constructor(name) {
        super(name);
    }

    read(packet) {
        return this.incoming[packet.data.getSpecialByte(6)]; 
    }

    write(packetName, packet) {
        packet.data.setSpecialByte(this.outgoing[packetName], 6);
    }

    async on_request(packet) {
        const nickname = packet.data.readString()[0],
              password = packet.data.readString()[0];
        await packet.player.login(nickname, password); 
    }

    async send_error(packet, type) {
        packet.setData(new ByteArray());
        this.write('send_error', packet);
        packet.data.writeUInt(errors[type]);
        packet.send();
    }

    async send_success(packet) {
        packet.setData(new ByteArray());
        this.write('send_success', packet);
        // TODO: Maybe later there data to send when the player logged
        packet.send();
    }

}

module.exports = Login;
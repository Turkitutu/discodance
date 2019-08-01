const { incoming, outgoing, cogs: { community } } = require('../utils/enums.js');

class Interface extends PIXI.Container {
    constructor() {
        super();
        this.name = 'interface';

        this.connection.use(outgoing, community.id, (id, packet) => {
            packet.setSpecialByte(id, 3);
        });

        this.connection.packet(outgoing, community.id, community.send_room_message, (packet, message) => {
            packet.writeString(message);
        });

        this.connection.packet(incoming, community.id, community.on_room_message, packet => {
            const message = packet.readString()[0];
            console.$log(message);
        });

        window.$sendRoomMessage = message => this.connection.send(community.id, community.send_room_message, message);
    }
    play() {

    }
}

module.exports = Interface;
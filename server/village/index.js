const Cog = require('../core/cog.js'),
      ByteArray = require('../../shared/bytearray.js');

class Village extends Cog {
    constructor(name) {
        super(name);
    }

    read(packet) {
        return this.incoming[packet.data.getSpecialByte(2)]; 
    }

    write(packetName, packet) {
        packet.data.setSpecialByte(this.outgoing[packetName], 2);
    }

    async on_player_join(packet) {
        packet.player.server.village.addPlayer(packet.player);
        await this.send_player_list(packet);
        await this.send_new_player(packet);
    }

    async on_player_movement(packet) {
        const state = packet.data.readBytes(1),
              x = packet.data.readInt(),
              y = packet.data.readInt(),
              vx = packet.data.readInt(),
              vy = packet.data.readInt();

        packet.setData(new ByteArray());
        this.write('send_movement', packet);

        packet.data
        .writeUInt(packet.player.id)
        .writeBytes(state, 1)
        .writeInt(x)
        .writeInt(y)
        .writeInt(vx)
        .writeInt(vy);

        packet.broadcast('ROOM_OTHERS');
    }

    async send_player_list(packet) {
        packet.setData(new ByteArray());
        this.write('send_player_list', packet);
        packet.data.writeUInt(packet.player.id);
        packet.data.writeString(packet.player.nickname);
        const players = packet.player.server.village.players;
        for (const id in players) {
            if (id != packet.player.id) {
                packet.data.writeUInt(id);
                packet.data.writeString(players[id].nickname);
            }
        }
        packet.send();
    }

    async send_new_player(packet) {
        packet.setData(new ByteArray());
        this.write('send_new_player', packet);
        packet.data.writeUInt(packet.player.id);
        packet.data.writeUInt(packet.player.nickname);
        packet.broadcast('ROOM_OTHERS');
    }

    async send_player_left(packet) {
        this.write('send_player_left', packet);
        packet.data.writeUInt(packet.player.id);
        packet.broadcast('ROOM_OTHERS');
    }
}

module.exports = Village;
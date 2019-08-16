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

    on_player_join(packet) {
        packet.player.server.village.addPlayer(packet.player);
        this.send_player_list(packet);
        this.send_new_player(packet);
    }

    on_player_movement(packet) {
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

    send_player_list(packet) {
        packet.setData(new ByteArray());
        this.write('send_player_list', packet);
        packet.data.writeUInt(packet.player.id);
        for (const id in packet.player.server.village.players) {
            if (id != packet.player.id) {
                packet.data.writeUInt(id);
            }
        }
        packet.send();
    }

    send_new_player(packet) {
        packet.setData(new ByteArray());
        this.write('send_new_player', packet);
        packet.data.writeUInt(packet.player.id);
        packet.broadcast('ROOM_OTHERS');
    }

    send_player_left(packet) {
        this.write('send_player_left', packet);
        packet.data.writeUInt(packet.player.id);
        packet.broadcast('ROOM_OTHERS');
    }
}

module.exports = Village;
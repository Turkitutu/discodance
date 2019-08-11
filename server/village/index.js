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

    on_player_joined(packet) {
        packet.player.server.village.addPlayer(packet.player);
        packet.player.x = 0;
        packet.player.y = 0;
        this.send_player_list(packet);
        this.send_new_player(packet);
    }

    on_player_moves(packet) {
        // read
    }

    send_player_list(packet) {
        packet.setData(new ByteArray());
        this.write('send_player_list', packet);

        packet.data.writeUInt(packet.player.id);
        packet.data.writeInt(packet.player.x);
        packet.data.writeInt(packet.player.y);

        const players = packet.player.room.players;
        packet.data.writeUInt(Object.keys(players).length-1);
        for (const id of Object.keys(players)) {
            if (id != packet.player.id) {
                packet.data.writeUInt(id);
                packet.data.writeInt(players[id].x);
                packet.data.writeInt(players[id].y);
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

    send_movement(packet) {
        this.write('send_movement', packet);
        // write
        packet.broadcast('ROOM_OTHERS');
    }

}

module.exports = Village;
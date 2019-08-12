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
        packet.player.x = 0; // village's x respawn point
        packet.player.y = 0; // village's y respawn point
        this.send_player_list(packet);
        this.send_new_player(packet);
    }

    on_player_movement(packet) {
        const player = packet.player;
        player.direction = packet.data.readInt();
        player.jumps = packet.data.readUInt();
        player.x = packet.data.readInt();
        player.y = packet.data.readInt();
        player.vx = packet.data.readInt();
        player.vy = packet.data.readInt();
        this.send_movement(packet, player.direction, player.jumps, player.x, player.y, player.vx, player.vy);
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

    send_movement(packet, direction, jumps, x, y, vx, vy) {
        packet.setData(new ByteArray());
        this.write('send_movement', packet);
        packet.data.writeUInt(packet.player.id);
        packet.data.writeInt(direction);
        packet.data.writeUInt(jumps);
        packet.data.writeInt(x);
        packet.data.writeInt(y);
        packet.data.writeInt(vx);
        packet.data.writeInt(vy);
        packet.broadcast('ROOM_OTHERS');
    }

}

module.exports = Village;
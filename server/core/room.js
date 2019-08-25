//var LAST_ID = 0;
const Packet = require("./packet.js");

class Room {
    constructor(players) {
        this.players = {};
        this.isVillage = false;
        //this.id = LAST_ID++;
        for (const player of players) {
            this.addPlayer(player);
        }
    }
    addPlayer(player) {
        this.players[player.id] = player;
        player.room = this;
    }

    removePlayer(player) {
        delete this.players[player.id];
    }

    async playerDisconnected(player) {
        if (this.isVillage) { 
            const packet = new Packet(player).setCog(3);
            await player.server.cogs[3].send_player_left(packet)
            delete this.players[player.id];
        }
    }
}

module.exports = Room;


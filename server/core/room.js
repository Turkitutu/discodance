//var LAST_ID = 0;

class Room {
    constructor(players) {
        this.players = [];
        //this.id = LAST_ID++;
        for (const player of players) {
            this.addPlayer(player)
        }
    }
    addPlayer(player) {
        this.players.push(player);
        player.room = this;
    }
}

module.exports = Room;
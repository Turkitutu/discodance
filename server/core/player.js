const players = new Set();

class Player {
    constructor(server, ws, req) {
        this.server = server;
        this.socket = ws;
        this.ipAddress = req.connection.remoteAddress;
        this.lastHeartbeat = 0;
        this.ping = 0;
        this._heartbeat = true;
        ws.on("pong", () => {
            this._heartbeat = true;
            this.ping = Date.now() - this.lastHeartbeat;
        });
        players.add(this);
        console.log(this.ipAddress+" connected");
    }
    /*
    get loggedIn() {
        return !!this.id; //if player has id then he is logged in.
    }
    */
    /*
    login(name, password) {
        //use the database to load info about the player    
    }
    */
}

setInterval(() => {
    for (const player of players) {
        if (player._heartbeat === false) {
            players.delete(player);
            return player.socket.terminate();
        }

        player._heartbeat = false;
        player.socket.ping(() => {
            player.lastHeartbeat = Date.now();
        });
    }
}, 10000);

module.exports = Player;
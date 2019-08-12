const players = new Set();

class Player {
    constructor(server, ws, req) {
        this.server = server;
        this.socket = ws;
        this.database = this.server.database;
        this.ipAddress = req.connection.remoteAddress;
        this.lastHeartbeat = 0;
        this.ping = 0;
        this._heartbeat = true;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.jumps = 0;
        this.direction = 1
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
    
    async login(name, password) {
        //use the database to load info about the player    
        result = await this.database.collection("users").findOne({ name: name, password: name});
        if (result) {
            this.data = result;
        }else {
            // send login error packet
        }
    }
    
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
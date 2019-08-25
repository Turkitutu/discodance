const players = new Set();
const Packet = require("./packet.js");


class Player {
    constructor(server, ws, req) {
        this.server = server;
        this.socket = ws;
        this.database = this.server.database;
        this.ipAddress = req.connection.remoteAddress;
        this.lastHeartbeat = 0;
        this.ping = 0;
        this._heartbeat = true;
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.jumps = 0;
        this.direction = 1;
        this.nickname = "";
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

    async sendLoginError(type) {
        const packet = new Packet(this).setCog(2); 
        await this.server.cogs[2].send_error(packet, type);
    }
    
    async login(nickname, password) {
        nickname = this.parseNickname(nickname);
        if (nickname == '' || password == ''){
            await this.sendLoginError('invalid');
            
        }else if (this.server.checkConnectedAccount(nickname)){
            await this.sendLoginError('areadyConnected');

        }else{
            const result = await this.database.collection("users").findOne({ nickname: nickname, password: password});
            if (!result) {
                await this.sendLoginError('invalid');
            }else {
                this.id = ++this.server.playerId;
                this.nickname = nickname;
                this.server.players[this.id] = this;
                const packet = new Packet(this).setCog(2); 
                await this.server.cogs[2].send_success(packet);
            }
        }
    }

    parseNickname(name) {
        return name.substr(0, 1).toUpperCase()+name.substr(1).toLowerCase();
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
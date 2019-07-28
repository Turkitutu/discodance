const Packet = require("./packet.js"),
      cogList = require("../utils/cogs");

class Player {
    constructor(server, ws, req) {
        this.server = server;
        this.socket = ws;
        this.ipAddress = req.connection.remoteAddress;
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

module.exports = Player;
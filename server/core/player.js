const Packet = require("./packet.js"),
      cogList = require("../utils/cogs");

class Player {
    constructor(server) {
        this.server = server;

        this.cogs = cogList.map((name, index) => { 
            const cog = new (require("../"+name))(name, this); 
            //cog.id = index;
            //cog.manager = this;
            return cog;
        });
    }

    onconnect(ws, req){
        this.socket = ws;
        this.ipAddress = req.connection.remoteAddress;
        console.log(this.ipAddress+" connected");
    }

    onmessage(data){
        console.log("data from "+this.ipAddress+" : "+data);
        const packet = new Packet(data, this.ws),
              cog = this.cogs[packet.cogId];
        cog[cog.read(packet)](packet);
    }

    onclose(){
        console.log(this.ipAddress+" disconnected");
    }
}

module.exports = Player;
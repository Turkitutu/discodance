const WebSocket = require("ws"),
	  Packet = require("./packet.js"),
	  settings = require("../config/settings"),
	  cogList = require("../config/cogs");

class CogManager {
	constructor() {
		this.cogs = cogList.map((name, index) => { 
	        const cog = new (require("../"+name))(name); 
	        //cog.id = index;
	        //cog.manager = this;
	        return cog;
		});
	}
	startServer() {
		this.server = new WebSocket.Server({port: settings.servers.discodance.port});
		this.server.on("connection", ws => {
			ws.on("message", message => {
				const packet = new Packet(message, ws),
					  cog = this.cogs[packet.cogId];
				cog[cog.read(packet)](packet);
			})
		});
	}
}

module.exports = CogManager;
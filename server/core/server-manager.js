const WebSocket = require("ws"),
	  Packet = require("./packet.js"),
	  Player = require("./player.js"),
	  cogs = require("../utils/cogs.json");

class ServerManager {
	constructor() {
		this.players = []; // TODO: Put the players who logged in.
		this.cogs = cogs.map( 
			name => new (require("../"+name))(name) 
		);
	}
	startServer() {
		this.wss = new WebSocket.Server({port: process.env.SERVER_PORT});
		console.log("Success!");
		this.wss.on("connection", (ws, req) => {
			const player = new Player(this, ws, req);
			this.players.push(player);
			ws.on("message", message => {
				const packet = new Packet(message, player),
		              cog = this.cogs[packet.cogId];
		        cog[cog.read(packet)](packet);
		        //cog.read(packet) is packetName;
		        //Example: if the packet name is "get_room_message" and the cog is Community
		       	//the code becomes:
		       	//Community["get_room_message"](packet);
		       	//which is the same as:
		       	//Community.get_room_message(packet);
			});
			ws.on("close", () => {
				//We will have constant packets, for example:
				//this.cogs.login.send_disconnected(Packets.disconnectionPacket)
			});
		});
	}
}

module.exports = ServerManager;
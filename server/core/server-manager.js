const WebSocket = require("ws"),
	  MongoClient = require('mongodb').MongoClient,
	  Packet = require("./packet.js"),
	  Player = require("./player.js"),
	  Room = require("./room.js"),
	  ByteArray = require("../../shared/bytearray.js"),
	  cogs = require("../utils/cogs.json");

class ServerManager {
	constructor() {
		this.players = {}; // TODO: Put the players who logged in.
		this.playerId = 0;
		this.cogs = cogs.map( 
			name => new (require("../"+name))(name) 
		);
	}
	async startServer() {
		this.database = await MongoClient.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
		console.log("Database loaded successfully!");

		this.wss = new WebSocket.Server({port: process.env.SERVER_PORT});
		console.log("Success!");
		//const room = new Room([]);
		this.village = new Room([]);
		this.village.isVillage = true;
		this.wss.on("connection", (ws, req) => {
			ws.binaryType = 'nodebuffer';
			const player = new Player(this, ws, req);
			player.id = this.playerId++;
			ws.on("message", message => {
				//console.log("Data from "+player.ipAddress+" : "+message); // Just for test
				const packets = new ByteArray(message);
				while (packets.bytesAvailable > 0) {
					const offset = packets.readOffset,
						  length = packets.readUInt(),
						  packet = new Packet(player, packets.subbuffer(offset, length)),
			              cog = this.cogs[packet.cogId];
			        if (cog) {
			        	cog[cog.read(packet)](packet);
			        } else {
			        	console.log('New cog : ['+packet.cogId+'] '+packet.data);
			        }
		    	}
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

				if (player.room){
					player.room.playerDisconnected(player);
				}

			});
		});
	}
}

module.exports = ServerManager;
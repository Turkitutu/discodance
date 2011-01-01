const WebSocket = require("ws"),
	Settings = require("./utils/settings.js"),
	PacketManager = require("./packets/packet-manager.js");

class Server {
	constructor() {
		this.settings = new Settings("./include/settings.json");
		this.packetManager = new PacketManager();
		console.log(this.packetManager);
	}
	startServer() {
		this.socket = new WebSocket.Server({port: this.settings.data.servers.discodance.port});
		this.socket.on("connection", (ws) => {
			ws.on("message", (message) => {
				console.log("[RECEIVED] ", message);
			});
			ws.send("From Server to Client, Saying Hello World :d")
		});
	}
}
module.exports = Server;
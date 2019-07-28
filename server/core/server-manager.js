const WebSocket = require("ws"),
	  Player = require("./player.js");

class ServerManager {
	constructor() {
		this.players = {} // TODO: Put the players who logged in.
	}
	startServer() {
		this.ws = new WebSocket.Server({port: process.env.SERVER_PORT});
		console.log("Success!");
		this.ws.on("connection", (ws, req) => {
			var player = new Player(this);
			player.onconnect(ws, req)
			ws.on("message", message => {player.onmessage(message)})
			ws.on("close", () => {player.onclose()})
		});
	}
}

module.exports = ServerManager;
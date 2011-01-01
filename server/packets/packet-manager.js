const events = require("events"),
	incoming = require("./incoming.js"),
	path = require("path"),
	fs = require("fs");

class PacketManager {
	constructor() {
		this.packets = {};
		let incomingPacket = "incoming";
		let incomingPacketDirectory = path.join(path.dirname(__filename), incomingPacket.replace(".", "\\"));
		fs.lstat(incomingPacketDirectory, (error, stat) => {
			if (stat.isDirectory()) {
				fs.readdir(incomingPacketDirectory, (error, files) => {
					let f, l = files.length;
					for (let i=0; i < l; i++) {
						f = path.join(incomingPacketDirectory, files[i]);
						let x = require(f);
						this.add(x);
					}
				});
			}
		});
	}

	add(i) {
		let code = i.identifiers[1] + (i.identifiers[0] << 8);
		if (!(code in this.packets)) {
			this.packets[code] = i;
		}
	}
}

module.exports = PacketManager;
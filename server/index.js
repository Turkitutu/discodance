const ServerManager = require("./core/server-manager");

const serverManager = new ServerManager();
(async () => {
	serverManager.startServer();
})()
.catch(err => console.error(err));

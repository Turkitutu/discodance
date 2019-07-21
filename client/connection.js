module.exports = class Connection {
    constructor() {
        this.connected = false;
    }

    connect(ip, port){
        this.ip = ip;
        this.port = port;
        this.socket = new WebSocket("ws://"+ip+":"+port);
        this.socket.onerror = function(error) {
            console.error(error);
        };
        this.socket.onopen = function(){
            this.connected = true;
        }
    }

    send(data){
        this.socket.send(data);
    }

}
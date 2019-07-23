const ByteArray = require('../shared/bytearray.js')

module.exports = class Connection {
    constructor() {
        this.connected = false;
        this.incoming = {};
        this.ingoing = {};
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

        this.socket.onclose = function(){
            this.connected = false;
            this.onclose();
        }

        this.socket.onmessage = function(event){
            const data = new ByteArray(event.data);
            const cog = data.readInt(),
                  id = data.readInt();
            if (this.incoming[cog]){
                if (this.incoming[cog][id]){
                    this.incoming[cog][id](data);
                }
            }
        }
    }

    packet(incoming, cog, id, func){
        if (incoming){
            if (!this.incoming[id]) this.incoming[id] = {};
            this.incoming[cog][id] = func;
        }else{
            if (!this.ingoing[id]) this.ingoing[id] = {};
            this.ingoing[cog][id] = func;
        }
    }

    send(cog, id, ...args){
        if (this.ingoing[cog]){
            if (this.ingoing[cog][id]){
                const data = this.ingoing[cog][id](...args);
                this.socket.send(new ByteArray().writeInt(cog).writeInt(id).buffer + data.buffer);
            }
        }
    }

    onclose(){
    }

}


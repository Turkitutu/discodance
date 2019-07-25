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
        this.socket.$onerror = (error) => {
            console.$error(error);
        };

        this.socket.$onopen = () => {
            this.connected = true;
        };

        this.socket.$onclose = () => {
            if (this.connected) this.onclose();
            this.connected = false;
        };

        this.socket.$onmessage = (event) => {
            const data = new ByteArray(event.$data);
            const cog = data.readUInt();
            if (this.incoming[cog]) {
                if (this.incoming[cog].special){
                    const packet_id = this.incoming[cog].special(data);
                }else{
                    const packet_id = data.readUInt();
                }
                if (this.incoming[cog].packets[packet_id]) {
                    this.incoming[cog].packets[packet_id](data);
                }
            }
        };
    }

    use(incoming, cog, func){
        if (incoming){
            if (!this.incoming[id]) this.incoming[id] = {};
            this.incoming[id].special = func;
        }else{
            if (!this.ingoing[id]) this.ingoing[id] = {};
            this.ingoing[id].special = func;
        }
    }

    packet(incoming, cog, id, func){
        if (incoming){
            if (!this.incoming[id]) this.incoming[id] = {packets : {}};
            this.incoming[cog].packets[id] = func;
        } else {
            if (!this.ingoing[id]) this.incoming[id] = {packets : {}};
            this.ingoing[cog].packets[id] = func;
        }
    }

    send(cog, id, ...args){
        if (this.ingoing[cog]){
            if (this.ingoing[cog][id]){
                const data = this.ingoing[cog].packets[id](...args);
                const packet = new ByteArray()
                if (this.ingoing[cog].special){
                    packet = this.ingoing[cog].special();
                }else{
                    packet = new ByteArray().writeUInt(cog).writeUInt(id);
                }
                this.socket.$send(packet.buffer + data.$buffer);
            }
        }
    }

    onclose(){
    }

}


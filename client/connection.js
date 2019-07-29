const ByteArray = require('../shared/bytearray.js')

module.exports = class Connection {
    constructor() {
        this.connected = false;
        this.incoming = {};
        this.outgoing = {};
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
            if (!this.outgoing[id]) this.outgoing[id] = {};
            this.outgoing[id].special = func;
        }
    }

    packet(incoming, cog, id, func){
        if (incoming){
            if (!this.incoming[id]) this.incoming[id] = {packets : {}};
            this.incoming[cog].packets[id] = func;
        } else {
            if (!this.outgoing[id]) this.outgoing[id] = {packets : {}};
            this.outgoing[cog].packets[id] = func;
        }
    }

    send(cog, id, ...args){
        if (this.outgoing[cog]){
            if (this.outgoing[cog][id]){
                const data = this.outgoing[cog].packets[id](...args);
                const packet = new ByteArray()
                if (this.outgoing[cog].special){
                    packet = this.outgoing[cog].special();
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


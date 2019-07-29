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

        this.socket.$onopen = (event) => {
            this.onopen();
            this.connected = true;
        };

        this.socket.$onerror = (error) => {
            console.$error(error);
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
            if (!this.incoming[cog]) this.incoming[cog] = {packets : {}};
            this.incoming[id].special = func;
        }else{
            if (!this.outgoing[cog]) this.outgoing[cog] = {packets : {}};
            this.outgoing[cog].special = func;
        }
    }

    packet(incoming, cog, id, func){
        if (incoming){
            if (!this.incoming[cog]) this.incoming[cog] = {packets : {}};
            this.incoming[cog].packets[id] = func;
        } else {
            if (!this.outgoing[cog]) this.outgoing[cog] = {packets : {}};
            this.outgoing[cog].packets[id] = func;
        }
    }

    send(cog, id, ...args){
        if (this.outgoing[cog]){
            if (this.outgoing[cog].packets){
                if (this.outgoing[cog].packets[id]){
                    const data = this.outgoing[cog].packets[id](...args);
                    const packet = new ByteArray()
                    packet.writeUInt(cog);
                    if (this.outgoing[cog].special){
                        this.outgoing[cog].special(id, packet);
                    }else{
                        //this is the default send function
                        packet.setSpecialByte(id, 1);
                    }
                    this.socket.$send(packet.writeBuf(data.buffer).buffer);
                }
            }
        }
    }

    onclose(){
    }
    onopen(){
    }

}


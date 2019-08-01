const ByteArray = require('../../shared/bytearray.js');

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
        this.socket.$binaryType = 'arraybuffer';

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

        this.socket.$onmessage = event => {
            const packets = new ByteArray(event.$data);
            while (packets.bytesAvailable > 0) {
                const offset = packets.readOffset,
                      length = packets.readUInt(),
                      data = new ByteArray(packets.subbuffer(offset, length)),
                      cog = data.readUInt();
                if (this.incoming[cog]) {
                    const packet_id = this.incoming[cog].special 
                                    ? this.incoming[cog].special(data)
                                    : data.readUInt();
                    if (this.incoming[cog].packets[packet_id]) {
                        this.incoming[cog].packets[packet_id](data);
                    }
                }
            }
        };
    }

    use(incoming, cog, func){
        if (incoming){
            if (!this.incoming[cog]) this.incoming[cog] = {packets : {}};
            this.incoming[cog].special = func;
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
        if (this.outgoing[cog] && this.outgoing[cog].packets && this.outgoing[cog].packets[id]) {
            const packet = new ByteArray();
            packet.writeUInt(cog);
            if (this.outgoing[cog].special) {
                this.outgoing[cog].special(id, packet);
            } else {
                //this is the default send function
                packet.setSpecialByte(id, 1);
            }
            this.outgoing[cog].packets[id](packet, ...args);
            this.socket.$send(packet.buffer);
        }
    }

    onclose(){
    }
    onopen(){
    }

}


class ByteArray {
    constructor(size){
        this.data = Buffer.alloc(size);
        this.writeOffset = 0;
        this.readOffset = 0;
        return this;
    }

    writeInt8(int){
        this.data.writeInt8(int, this.writeOffset);
        this.writeOffset ++;
        return this;
    }

    writeUInt8(int){
        this.data.writeUInt8(int, this.writeOffset);
        this.writeOffset ++;
        return this;
    }

    writeInt16(int){
        this.data.writeInt16BE(int, this.writeOffset);
        this.writeOffset += 2;
        return this;
    }

    writeUInt16(int){
        this.data.writeUInt16BE(int, this.writeOffset);
        this.writeOffset += 2;
        return this;
    }

    writeInt32(int){
        this.data.writeInt32BE(int, this.writeOffset);
        this.writeOffset += 4;
        return this;
    }

    writeUInt32(int){
        this.data.writeUInt32BE(int, this.writeOffset);
        this.writeOffset += 4;
        return this;
    }

    writeUTF(string){
        var length = Buffer.byteLength(string, 'utf8');
        this.writeUInt16(length)
        this.data.write(string, this.writeOffset)
        this.writeOffset += length;
        return this;
    }

    writeLongUTF(string){
        var length = Buffer.byteLength(string, 'utf8');
        this.writeUInt32(length)
        this.data.write(string, this.writeOffset)
        this.writeOffset += length;
        return this;
    }

    readInt8(){
        return this.data.readInt8(this.readOffset++);
    }

    readUInt8(){
        return this.data.readUInt8(this.readOffset++);
    }

    readInt16(){
        var int = this.data.readInt16BE(this.readOffset);
        this.readOffset += 2;
        return int;
    }

    readUInt16(){
        var int = this.data.readUInt16BE(this.readOffset);
        this.readOffset += 2;
        return int;
    }

    readInt32(){
        var int = this.data.readInt32BE(this.readOffset);
        this.readOffset += 4;
        return int;
    }

    readUInt32(){
        var int = this.data.readUInt32BE(this.readOffset);
        this.readOffset += 4;
        return int;
    }

    readUTF(){
        var length = this.readUInt16()
        var string = this.data.toString('utf8', this.readOffset, this.readOffset+length);
        this.readOffset+=length;
        return string;
    }

    readLongUTF(){
        var length = this.readUInt32()
        var string = this.data.toString('utf8', this.readOffset, this.readOffset+length);
        this.readOffset+=length;
        return string;
    }

}


module.exports = ByteArray;
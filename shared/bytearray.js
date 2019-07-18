class ByteArray {

    constructor(buf){
        this.defaultSize = 1024;
        this.writeOffset = 0;
        this.readOffset = 0;
        this.currentBool = {
            readOffset : 0,
            writeOffset : 0,
            readPos : 0,
            writePos : 0
        }
        if (typeof buf !== 'undefined') {
            this.data = Buffer.from(buf);
            this.writeOffset = this.data.length;
        } else {
            this.data = Buffer.alloc(this.defaultSize);
        }
    }

    writeUInt(int) {
        this.checkSize(4);
        if (int < 64) {
            this.data.writeUInt8(int, this.writeOffset++);
        } else if (int < 16384) {
            this.data.writeUInt16BE(16384 | int, this.writeOffset);
            this.writeOffset += 2;
        } else if (int < 4194304) {
            const n = 8388608 | int;
            this.data.writeUInt8(255 & (n >> 16) , this.writeOffset++);
            this.data.writeUInt16BE(65535 &  n, this.writeOffset);
            this.writeOffset += 2;
        } else {
            this.data.writeUInt32BE(3221225472 + int, this.writeOffset);
            this.writeOffset += 4;
        }
        return this;
    }

    writeInt(int) {
        this.checkSize(4);
        const positive = int > 0;
        int = positive ? int : -int;
        if (int < 32) {
            this.data.writeUInt8((positive ? 0 : 32) | int, this.writeOffset++);
        } else if (int < 8192) {
            this.data.writeUInt16BE((positive ? 16384 : 24576) | int, this.writeOffset);
            this.writeOffset += 2;
        } else if (int < 2097152) {
            const n = (positive ? 8388608 : 10485760) | int;
            this.data.writeUInt8(255 & (n >> 16) , this.writeOffset++);
            this.data.writeUInt16BE(65535 &  n, this.writeOffset);
            this.writeOffset += 2;
        } else {
            this.data.writeUInt32BE((positive ? 3221225472 : 3758096384) + int, this.writeOffset);
            this.writeOffset += 4;
        }
        return this;
    }

    writeString(string){
        var length = Buffer.byteLength(string, 'utf8');
        this.writeUInt(length);
        this.checkSize(length);
        this.data.write(string, this.writeOffset);
        this.writeOffset += length;
        return this;
    }

    writeBoolean(bool) {
        if (this.currentBool.writeOffset !== this.writeOffset-1 || this.currentBool.writePos > 7) {
            this.currentBool.writeOffset = this.writeOffset++;
            this.currentBool.writePos = 0;
            this.checkSize(1);
        }
        this.data.writeUInt8(this.data[this.currentBool.writeOffset] | ((bool ? 1 : 0) << this.currentBool.writePos++), this.currentBool.writeOffset);
        return this;
    }

    readUInt() {
        let data = this.data.readUInt8(this.readOffset++),
            bytes = data >> 6;
        data &= 63;
        if (bytes == 0) {
            return data;
        } else if (bytes == 1) {
            return (data << 8) | this.data.readUInt8(this.readOffset++);
        } else if (bytes == 2) {
            data = (data << 16) | this.data.readUInt16BE(this.readOffset);
            this.readOffset += 2;
            return data;
        } else {
            data = (data << 24) + (this.data.readUInt8(this.readOffset++) << 16) + this.data.readUInt16BE(this.readOffset);
            this.readOffset += 2;
            return data;
        }
    }

    readInt() {
        let data = this.data.readUInt8(this.readOffset++),
            bytes = data >> 6,
            positive = !((data >> 5) & 1);
        data &= 31;
        if (bytes == 1) {
            data = (data << 8) | this.data.readUInt8(this.readOffset++);
        } else if (bytes == 2) {
            data = (data << 16) | this.data.readUInt16BE(this.readOffset);
            this.readOffset += 2;
        } else if (bytes) {
            data = (data << 24) + (this.data.readUInt8(this.readOffset++) << 16) + this.data.readUInt16BE(this.readOffset);
            this.readOffset += 2;
        }
        return positive ? data : -data;
    }

    readString(){
        var length = this.readUInt()
        var string = this.data.toString('utf8', this.readOffset, this.readOffset+length);
        this.readOffset+=length;
        return string;
    }

    readBoolean() {
        if (this.currentBool.readOffset !== this.readOffset-1 || this.currentBool.readPos > 7) {
            this.currentBool.readOffset = this.readOffset++;
            this.currentBool.readPos = 0;
        }
        return !!(1 & (this.data[this.currentBool.readOffset] >> this.currentBool.readPos++));
    }

    checkSize(length) {
        if (this.writeOffset+length > this.data.length){
            this.data = Buffer.concat(this.data, Buffer.alloc(this.defaultSize))
        }
    }

    get buf() {
        return this.data.slice(0, this.writeOffset);
    }

    get bytesAvailable() {
        return this.writeOffset - this.readOffset;
    }

}

module.exports = ByteArray;


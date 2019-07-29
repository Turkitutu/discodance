const Buffer = require('buffer').Buffer;

class ByteArray {

    constructor(buf){
        this.defaultSize = 1024;
        this.writeOffset = 0;
        this.readOffset = 0;
        this.specialOffset = -1;
        this.currentBool = {
            readOffset : 0,
            writeOffset : 0,
            readPos : 0,
            writePos : 0
        }
        if (buf !== undefined) {
            this.data = Buffer.from(buf);
            this.writeOffset = this.data.length;
        } else {
            this.data = Buffer.alloc(this.defaultSize);
        }
    }

    writeBytes(int, length){
        if (this.writeOffset <= this.specialOffset && this.specialOffset < this.writeOffset+length){
            this.checkSize(length+1);
            for (var i = length-1; i >= 0; i--){
                if (this.writeOffset == this.specialOffset) this.writeOffset++;
                this.data.writeUInt8((int >> (8*i)) & 255, this.writeOffset++);
            }
        }else{
            this.checkSize(length);
            this.data.writeUIntBE(int, this.writeOffset, length);
            this.writeOffset += length;
        }
    }

    writeUInt(int) {
        if (int < 64) {
            this.writeBytes(int, 1);
        } else if (int < 16384) {
            this.writeBytes(16384 | int, 2);
        } else if (int < 4194304) {
            this.writeBytes(8388608 | int, 3);
        } else {
            this.writeBytes(3221225472 + int, 4);
        }
        return this;
    }

    writeInt(int) {
        const positive = int > 0;
        int = positive ? int : -int;
        if (int < 32) {
            this.writeBytes((positive ? 0 : 32) | int, 1);
        } else if (int < 8192) {
            this.writeBytes((positive ? 16384 : 24576) | int, 2);
        } else if (int < 2097152) {
            this.writeBytes((positive ? 8388608 : 10485760) | int, 3);
        } else {
            this.writeBytes((positive ? 3221225472 : 3758096384) + int, 4);
        }
        return this;
    }

    writeString(string){
        const str = Buffer.from(string);
        this.writeUInt(str.length);
        if (this.writeOffset <= this.specialOffset && this.specialOffset < this.writeOffset+str.length){
            this.checkSize(str.length+1);
            const n = this.specialOffset-this.writeOffset;
            str.copy(this.data, this.writeOffset, 0, n);
            this.writeOffset += n+1;
            str.copy(this.data, this.writeOffset, n, str.length);
            this.writeOffset += str.length-n;

        }else{
            this.checkSize(str.length);
            this.data.write(string, this.writeOffset);
            this.writeOffset += str.length;
        }
        return this;
    }

    writeBoolean(bool) {
        if (this.currentBool.writeOffset !== this.writeOffset-1 || this.currentBool.writePos > 7) {
            if (this.writeOffset == this.specialOffset) this.writeOffset++;
            this.currentBool.writeOffset = this.writeOffset++;
            this.currentBool.writePos = 0;
            this.checkSize(1);
        }
        this.data.writeUInt8(this.data[this.currentBool.writeOffset] | ((bool ? 1 : 0) << this.currentBool.writePos++), this.currentBool.writeOffset);
        return this;
    }

    readBytes(length){
        var data = 0;
        if (this.readOffset <= this.specialOffset && this.specialOffset < this.readOffset+length){
            for (var i = length-1; i >= 0; i--){
                if (this.readOffset == this.specialOffset) this.readOffset++;
                data += this.data.readUInt8(this.readOffset++) << (8*i);
            }
        }else{
            data = this.data.readUIntBE(this.readOffset, length);
            this.readOffset += length;
        }
        return data;
    }

    readUInt() {
        let data = this.readBytes(1),
            bytes = data >> 6;
        data &= 63;
        if (bytes == 0) {
            return data;
        } else if (bytes == 1) {
            return (data << 8) | this.readBytes(1);
        } else if (bytes == 2) {
            return (data << 16) | this.readBytes(2);
        } else {
            return (data << 24) + this.readBytes(3);
        }
    }

    readInt() {
        let data = this.readBytes(1),
            bytes = data >> 6,
            positive = !((data >> 5) & 1);
        data &= 31;
        if (bytes == 1) {
            data = (data << 8) | this.readBytes(1);
        } else if (bytes == 2) {
            data = (data << 16) | this.readBytes(2);
        } else if (bytes) {
            data = (data << 24) + this.readBytes(3);
        }
        return positive ? data : -data;
    }

    readString(){
        const length = this.readUInt();
        var string = "";
        if (this.readOffset <= this.specialOffset && this.specialOffset < this.readOffset+length){
            const n = this.specialOffset-this.readOffset;
            string += this.data.toString('utf8', this.readOffset, this.readOffset+n);
            this.readOffset += n + 1;
            string += this.data.toString('utf8', this.readOffset, this.readOffset+length-n);
            this.readOffset += length-n;
        }else{
            string = this.data.toString('utf8', this.readOffset, this.readOffset+length);
            this.readOffset+=length;
        }
        return string;
    }

    readBoolean() {
        if (this.currentBool.readOffset !== this.readOffset-1 || this.currentBool.readPos > 7) {
            if (this.readOffset == this.specialOffset) this.readOffset++;
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

    get buffer() {
        return this.data.slice(0, this.writeOffset);
    }

    get bytesAvailable() {
        return this.writeOffset - this.readOffset;
    }

    setSpecialByte(byte, pos){
        this.data.writeUInt8(byte, pos);
        this.spciealOffset = pos;
        return this;
    }

    getSpecialByte(pos){
        return this.data.readUInt8(this.specialOffset=(pos || this.specialOffset));
    }

}

module.exports = ByteArray;
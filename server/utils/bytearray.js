"use strict"
const ByteArray = function(data) {
	this.data = [], this.main = [];
	this.list = this.data;
	if (data) {
		this.data = [].slice.call(new Uint8Array(data));
	}
}

ByteArray.stringToUtf8ByteArray = function(str) {
	let out = [], p = 0;
	for (let i = 0; i < str.length; i++) {
		let c = str.charCodeAt(i);
		if (c < 128) {
			out[p++] = c;
		} else if (c < 2048) {
			out[p++] = (c >> 6) | 192;
			out[p++] = (c & 63) | 128;
		} else if (
			((c & 0xFC00) === 0xD800) && (i + 1) < str.length &&
			((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
			c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
			out[p++] = (c >> 18) | 240;
			out[p++] = ((c >> 12) & 63) | 128;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		} else {
			out[p++] = (c >> 12) | 224;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
	}
	return out;
};

ByteArray.utf8ByteArrayToString = function(bytes) {
	let out = [], pos = 0, c = 0;
	while (pos < bytes.length) {
		let c1 = bytes[pos++];
		let c2;
		let c3;
		if (c1 < 128) {
			out[c++] = String.fromCharCode(c1);
		} else if (c1 > 191 && c1 < 224) {
			c2 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else if (c1 > 239 && c1 < 365) {
			c2 = bytes[pos++];
			c3 = bytes[pos++];
			let c4 = bytes[pos++];
			let u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
			out[c++] = String.fromCharCode(0xD800 + (u >> 10));
			out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
		} else {
			c2 = bytes[pos++];
			c3 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		}
	}
	return out.join('');
};

ByteArray.prototype.getArrayBuffer = function() {
	return new Uint8Array(this.main.concat(this.data)).buffer;
}
ByteArray.prototype.remaining = function() {
	return this.list.shift() === 1
}
// Reading
ByteArray.prototype.readBool = function() {
	return this.list.shift() === 1
}
ByteArray.prototype.readByte = function() {
	return this.list.shift() & 0xFF;
}
ByteArray.prototype.readShort = function() {
	return this.readByte() << 8 | this.readByte();
}
ByteArray.prototype.readInt = function() {
	return (this.readByte() << 24) | (this.readByte() << 16) | (this.readByte() << 8) | this.readByte();
}
ByteArray.prototype.readUTF = function(size){
	return ByteArray.utf8ByteArrayToString(this.list.splice(0, size ? size : this.readShort()));
}
// Writing
ByteArray.prototype.writeCode = function(C, CC) {
	this.writeByte(C).writeByte(CC);
}
ByteArray.prototype.writeBool = function(value) {
	this.list.push(value ? 1 : 0);
	return this;
}
ByteArray.prototype.writeByte = function(value) {
	this.list.push(value & 0xFF);
	return this;
}
ByteArray.prototype.writeShort = function(value) {
	this.list.push((value >>> 8) & 0xFF);
	this.list.push(value & 0xFF);
	return this;
}
ByteArray.prototype.writeInt = function(value) {
	this.list.push((value >>> 24) & 0xFF);
	this.list.push((value >>> 16) & 0xFF);
	this.list.push((value >>> 8) & 0xFF);
	this.list.push(value & 0xFF);
	return this;
}
ByteArray.prototype.writeUTF = function(value) {
	this.writeShort(value.length);
	this.data = this.data.concat(ByteArray.stringToUtf8ByteArray(value));
	this.list = this.data;
	return this;
}
ByteArray.prototype.writeGrossUTF = function(value) {
	this.data = this.data.concat(ByteArray.stringToUtf8ByteArray(value));
	this.list = this.data;
	return this;
}
module.exports = ByteArray;
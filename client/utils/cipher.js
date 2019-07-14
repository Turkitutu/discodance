module.exports = class Cipher {
	constructor() {
		this.connection_key = "";
		this.secret_keys = [];
		this.intkey = new Date().getTime();
	}
	generateConnectionKey() {
		let res = "",
			chrs = "zYxWvUtSrQpOnMlKjIhGfEdCbA",
			chrlen = this.intkey;
		for (let i=0; i < chrlen.toString().length; i++) {
			res += chrs.charAt(chrlen.toString().charAt(i));
		}
		this.connection_key = res;
	}
	generateSecretKeys() {
		this.secret_keys.push(this.intkey << 8);
		this.secret_keys.push((this.intkey | 16) << 10);
		this.secret_keys.push((this.intkey | 24) >>> 64);
		this.secret_keys.push(((this.intkey << 32) >>> 2) ^ this.secret_keys[0]);
	}
};
class TestPacket {
	static dispatch(packet) {
		console.log(packet, "XXX");
	}
}
TestPacket.identifiers = [1, 1];

module.exports = TestPacket;
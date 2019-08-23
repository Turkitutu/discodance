const Scene = require('../core/scene.js'),
      PhysicObject = require('../physics/object.js'),
      {incoming, outgoing, cogs:{village}} = require('../utils/enums.js'),
      Player = require('../physics/player.js');

class Village extends Scene {
    constructor() {
        super();
        this.playerList = {};
        this.loaded = false;
        this.sendingFrame = false;
        this.index = null;

        this.connection.use(incoming, village.id, (packet) => {
            return packet.getSpecialByte(2);
        });
        this.connection.use(outgoing, village.id, (id, packet) => {
            packet.setSpecialByte(id, 2);
        });
        this.connection.packet(outgoing, village.id, village.send_join, packet => {
            // Sends a request to join the village
        });
        this.connection.packet(incoming, village.id, village.on_player_list, packet => {
            // This is the player list of village received from the server
            const id = packet.readUInt();
            this.player = new Player([0, 0]);
            this.addPlayer(id, this.player);
            this.camera.focus([this.player]);
            this.camera.zoom(0.4);

            while (packet.bytesAvailable > 0) {
                this.addPlayer(packet.readUInt(), new Player([0, 0]));
            }

            this.loaded = true;
        });
        this.connection.packet(incoming, village.id, village.on_new_player, packet => {
            // When a new player joins the village
            const id = packet.readUInt(),
                  player = new Player([0, 0]);
            this.addPlayer(id, player);
            this.player.prevData = null;
        });
        this.connection.packet(incoming, village.id, village.on_player_left, packet => {
            // When a player leaves the village
            const id = packet.readUInt();
            this.removePlayer(id);
        });
        this.connection.packet(outgoing, village.id, village.send_movement, packet => {
            this.player.writePacket(packet);
        });
        this.connection.packet(incoming, village.id, village.on_player_movement, packet => {
            const player = this.playerList[packet.readUInt()];
            player.readPacket(packet);
        });
    }

    play() {
        this.scenes.interface.play();
        
        this.camera.target(this);

        this.addChild(this.world.debug.renderer);

        this.enable();

        this.addObject(new PhysicObject({
            shape: new box2d.b2PolygonShape().SetAsBox(20, 0.5),
            x: 0,
            y: 5
        }));

        this.connection.send(village.id, village.send_join);
    }
    update() {
        if (!this.loaded) return;

        const length = this.player.readInput(this.input);

        for (const id in this.playerList) {
            this.playerList[id].update();
        }

        this.world.update();

        this.sendingFrame = !this.sendingFrame;
        if (this.sendingFrame) {
            if (this.player.hasChanged()) {
                this.connection.send(village.id, village.send_movement);
            }
        }
    }
    disable() {
        this.world.clear();
        for (const child of this.$children) {
            this.removeChild(child);
            child.destroy(true);
        }
        super.disable();
    }
    addPlayer(id, player) {
        this.addObject(player);
        this.playerList[id] = player;
        if (this.index === null) {
            this.index = this.$children.indexOf(this.player.sprite);
        }
        this.$children[this.index] = player.sprite;
        this.index = this.$children.length-1;
        this.$children[this.index] = this.player.sprite;
    }
    addObject(obj) {
        this.world.add(obj);
        if (obj.sprite) this.addChild(obj.sprite);
    }
    removePlayer(id) {
        this.removeObject(this.playerList[id]);
        delete this.playerList[id];
    }
    removeObject(obj) {
        this.world.remove(obj);
        if (obj.sprite){
            obj.sprite.destroy(false);
            this.index = null;
        }
    }
}

module.exports = Village;
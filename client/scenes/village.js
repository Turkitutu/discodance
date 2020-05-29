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
            this.player = new Player([0, 0]);
            this.player.id = packet.readUInt();
            this.player.nickname = packet.readString()[0];
            this.addPlayer(this.player);
            window.$player = this.player;
            this.camera.focus([this.player]);
            this.camera.zoom(0.2);

            while (packet.bytesAvailable > 0) {
                const player = new Player([0, 0]);
                player.id = packet.readUInt();
                player.nickname = packet.readString()[0];
                this.addPlayer(player);
            }

            this.loaded = true;
        });
        this.connection.packet(incoming, village.id, village.on_new_player, packet => {
            // When a new player joins the village
            const player = new Player([0, 0]);
            player.id = packet.readUInt();
            player.nickname = packet.readString()[0];
            this.addPlayer(player)
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
            restitution: 0.1,
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
    addPlayer(player) {
        this.addObject(player);
        this.addChild(player.nicknameText);
        this.playerList[player.id] = player;
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
        this.removeChild(this.playerList[id].nicknameText);
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
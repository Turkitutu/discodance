const Scene = require('../core/scene.js'),
      PhysicObject = require('../physics/object.js'),
      Player = require('../physics/player.js'),
      fields = require('../fields/'),
      {incoming, outgoing, cogs:{field}} = require('../utils/enums.js');

class Field extends Scene {
    constructor() {
        super();
        this.reset();
        fields.forEach(field => field.construct = field.construct.bind(this));
        this.playerList = {};
        this.loaded = false;
        this.sendingFrame = false;
        this.index = null;

        /*this.connection.packet(incoming, field.id, field.on_player_list, packet => {
            // This is the player list of field received from the server
            const id = packet.readUInt();
            this.player = new Player([0, 0]);
            this.addPlayer(id, this.player);
            this.camera.focus([this.player]);
            this.camera.zoom(0.1);

            while (packet.bytesAvailable > 0) {
                this.addPlayer(packet.readUInt(), new Player([0, 0]));
            }

            this.loaded = true;
        });
        this.connection.packet(incoming, field.id, field.on_new_player, packet => {
            // When a new player joins the field
            const id = packet.readUInt(),
                  player = new Player([0, 0]);
            this.addPlayer(id, player);
            this.player.prevData = null;
        });
        this.connection.packet(incoming, field.id, field.on_player_left, packet => {
            // When a player leaves the field
            const id = packet.readUInt();
            this.removePlayer(id);
        });
        this.connection.packet(outgoing, field.id, field.send_movement, packet => {
            this.player.writePacket(packet);
        });
        this.connection.packet(incoming, field.id, field.on_player_movement, packet => {
            const player = this.playerList[packet.readUInt()];
            player.readPacket(packet);
        });*/
    }
    reset() {
        this.playerList = [];
        this.loaded = false;
        this.spawnOffset = 0;
        this.field = null;
    }
    play() {
        this.scenes.interface.play();
        
        this.field = fields[this.world.fieldId];
        
        PhysicObject.colorTarget = this.playerList;
        
        PIXI.loaders.shared
            .add(this.field.assets)
            .load((loader, resources) => {
                this.field.construct(resources);
                this.loaded = true;
                this.load();
            });

        this.enable();
    }
    load() {
        this.camera.target(this);

        this.player = new Player(this.nextSpawn());
        this.addPlayer(this.player);

        this.addChild(this.world.debug.renderer);

        this.camera.focus(this.playerList);
        this.camera.zoom(0.7);
    }
    update(delta) {
        if (!this.loaded) return;

        this.player.movement = Player.handleMoves(this.input);

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
    }
    disable() {
        this.world.clear();
        for (const child of this.$children) {
            this.removeChild(child);
            child.destroy(true);
        }
        this.reset();

        super.disable();
    }
    nextSpawn() {
        return this.field.spawn[this.spawnOffset++] || this.field.spawn[this.spawnOffset=0];
    }
    addPlayer(player) {
        this.addObject(player);
        this.playerList.push(player);
    }
    addObject(obj) {
        this.world.add(obj);
        if (obj.sprite) this.addChild(obj.sprite);
    }
}

module.exports = Field;
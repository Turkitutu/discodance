const Scene = require('../core/scene.js'),
      PhysicObject = require('../physics/object.js'),
      {incoming, outgoing, cogs} = require('../utils/enums.js'),
      Player = require('../physics/player.js');

class Village extends Scene {
    constructor() {
        super();
        this.playerList = [];
        this.loaded = false;
        this.checkTime = 0;
        this.lastMovement = [];

        this.connection.use(incoming, cogs.village.id, (packet) => {
            return packet.getSpecialByte(2);
        });
        this.connection.use(outgoing, cogs.village.id, (id, packet) => {
            packet.setSpecialByte(id, 2);
        });
        this.connection.packet(outgoing, cogs.village.id, cogs.village.send_join, packet => {
            // Sends a request to join the village
        });
        this.connection.packet(incoming, cogs.village.id, cogs.village.on_player_list, packet => {
            // This is the player list of village received from the server
            const id = packet.readUInt(),
                  x = packet.readInt(),
                  y = packet.readInt();
            this.player = new Player([x, y]);
            this.lastMovement = [x, y];
            this.addPlayer(this.player);
            this.camera.focus([this.player]);
            this.camera.zoom(0.1);

            const n = packet.readUInt();
            for(let i = 0; i < n; i++){
                const _id = packet.readUInt(),
                      _x = packet.readInt(),
                      _y = packet.readInt();
                const player = new Player([_x, _y]);
                player.id = _id;
                this.addPlayer(player);
            }
            this.loaded = true;
        });
        this.connection.packet(incoming, cogs.village.id, cogs.village.on_new_player, packet => {
            // When a new player joins the village
            const id = packet.readUInt();
            const player = new Player([0, 0]);
            player.id = id;
            this.addPlayer(player);
        });
        this.connection.packet(incoming, cogs.village.id, cogs.village.on_player_left, packet => {
            // When a player leaves the village
            const id = packet.readUInt();
            this.removePlayer(id);
        });
        this.connection.packet(outgoing, cogs.village.id, cogs.village.send_movement, (packet, direction, jumps, x, y, vx, vy) => {
            packet.writeInt(direction);
            packet.writeUInt(jumps);
            packet.writeInt(x);
            packet.writeInt(y);
            packet.writeInt(vx);
            packet.writeInt(vy);
        });
        this.connection.packet(incoming, cogs.village.id, cogs.village.on_player_movement, (packet) => {
            const player = this.getPlayer(packet.readUInt());
            const jumps = packet.readUInt(); // soon
            const direction = packet.readInt();
            player.sprite.$scale.$x *= direction;
            player.direction = direction;
            const x = packet.readInt()/100;
            const y = packet.readInt()/100;
            const vx = packet.readInt()/100;
            const vy = packet.readInt()/100;
            const vel = player.body.GetLinearVelocity();
            vel.x = vx;
            vel.y = vy;
            player.body.SetLinearVelocity(vel);
            if (vel.x == 0 || vel.y == 0) player.body.SetPosition(new box2d.b2Vec2(x, y));
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
        this.connection.send(cogs.village.id, cogs.village.send_join);
    }
    checkMovement() {
        const pos = this.player.body.GetPosition();
        const vel = this.player.body.GetLinearVelocity();
        //if (lastMovement[0] != pos.$x || lastMovement[1] != pos.$y){
            this.connection.send(cogs.village.id, cogs.village.send_movement, 
                this.player.direction,
                this.player.jumps,
                Math.round(pos.$x*100),
                Math.round(pos.$y*100),
                Math.round(vel.x*100),
                Math.round(vel.y*100)
            );
            //this.lastMovement = [pos.$x, pos.$y];
        //}

    }
    update(delta) {
        if (!this.loaded) return;

        this.player.movement = Player.handleMoves(this.input);

        for (const player of this.playerList) {
            player.update();
        }

        this.world.update(delta);
        this.checkTime++;
        if (this.checkTime == 2){
            this.checkTime = 0;
            this.checkMovement()
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
        this.playerList.push(player);
    }
    addObject(obj) {
        this.world.add(obj);
        if (obj.sprite) this.addChild(obj.sprite);
    }
    removePlayer(id) {
        const player = this.getPlayer(id);
        for(let i = 0; i < this.playerList.length; i++){
            if (player.id == this.playerList[i].id) {
                this.playerList.splice(i, 1);
                break;
            }
        }
        this.removeObject(player);
    }
    removeObject(obj) {
        this.world.remove(obj);
        if (obj.sprite){
            this.removeChild(obj.sprite);
        }
    }
    getPlayer(id){
        for (const player of this.playerList) {
            if (player.id == id) return player;
        }
    }
}

module.exports = Village;
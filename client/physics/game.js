// to be executed once the window loads
window.onload = function(){

    var config = {

        type: Phaser.CANVAS,
        width: 640,
        height: 480,
        backgroundColor: "#000044",
        physics: {
            default: "matter"
        },
        scene: [playGame]
    };

    var game = new Phaser.Game(config);
}

var playGame = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    function playGame(){

        Phaser.Scene.call(this, {key: "PlayGame"});
    },

    preload: function(){
        this.load.image("crate", "crate.png");
    },

    create: function(){

        // setting Matter world bounds
        this.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);

        // waiting for user input
        this.input.on("pointerdown", function(pointer){

            // getting Matter bodies under the pointer
            var bodiesUnderPointer = Phaser.Physics.Matter.Matter.Query.point(this.matter.world.localWorld.bodies, pointer);

            // if there isn't any body under the pointer...
            if(bodiesUnderPointer.length == 0){

                // create a crate
                this.matter.add.sprite(pointer.x, pointer.y, "crate");
            }

            // this is where I wanted to remove the crate. Unfortunately I did not find a quick way to delete the Sprite
            // bound to a Matter body, so I am setting it to invisible, then remove the body.
            else{
                bodiesUnderPointer[0].gameObject.visible = false;
                this.matter.world.remove(bodiesUnderPointer[0])
            }
        }, this);
    }
});

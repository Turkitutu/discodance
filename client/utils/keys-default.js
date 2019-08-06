const keys = {
    up: {
        name: "up",
        keyCode: 38,
        aliases: [87]
    },
    left: {
        name: "left",
        keyCode: 37,
        aliases: [65]
    },
    right: {
        name: "right",
        keyCode: 39,
        aliases: [68]
    },
    enter: {
        name: "enter",
        keyCode: 13
    }
}

keys.left.opposite = keys.right;
keys.right.opposite = keys.left;

module.exports = keys;
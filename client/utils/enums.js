module.exports = {
    incoming : true,
    outgoing : false,
    cogs : {
        community : {
            id : 0,
            on_room_message: 0,
            send_room_message : 0
        },
        authentication : {
            id : 1,
            handshake : 1,
        }
    }
}
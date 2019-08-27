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
        },
        login : {
            id : 2,
            on_error : 0,
            on_success : 1,

            send_request : 0,
        },
        village : {
            id : 3,
            on_player_list : 0,
            on_new_player : 1,
            on_player_left : 2,
            on_player_movement : 3,

            send_join : 0,
            send_movement : 1
        }
    },
    states: {
        idle: 1,
        run: 2,
        jump: 3,
        jumpForward: 4,
        slide: 5,
        slideForward: 6
    }
}
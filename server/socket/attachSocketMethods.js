const pool = require('../modules/pool')
const attachSocketMethods = (socket, io, serverMethods) => {
    socket.on('test', data => {
        console.log(`IN TEST`);

    })

    socket.on('LOG_ME_OUT', data=>{
        console.log(`LOGGING USER OUT`);
        
        socket.disconnect();
    })
    socket.on('SEND_MESSAGE', data => {
        let chatId = data.chatId
        let userId = socket.request.session.passport.user
        let message = data.input
        let socketIdSendingMessage = socket.id

        console.log(`-----------------`);
        console.log(userId);



        // console.log(`THIS SOCKET HAS THESE ROOMS`);
        // console.log(socket.rooms);
        if (socket.rooms.hasOwnProperty(chatId)) {

            let queryText = `INSERT INTO "messages" ("message", "chat_id", "user_id")
                            VALUES($1, $2, $3);`
            pool.query(queryText, [message, chatId, userId])
                .then(response => {
                    console.log(response);

                    // console.log(`THE USER IS IN THIS ROOM, WE CAN SEND A MESSAGE`);
                    io.to(chatId).emit('NEW_MESSAGE')
                    // console.log(io.sockets[socket.id]);
                    let listOfAllSocketObjects = io.sockets
                    let currentRoomSocketNames = io.adapter.rooms[chatId].sockets
                    // console.log(io);

                    for (roomSocket in currentRoomSocketNames) {
                        // console.log(listOfAllSocketObjects[roomSocket]);
                        serverMethods.getChats(listOfAllSocketObjects[roomSocket])
                    }

                    // serverMethods.getChats(socketThatSentMEssage)

                }).catch(err => {
                    console.log(err);

                })


        }
        else {
            //THIS SHOULD ONLY TRIGGER IF THE USER MODIFIED THEIR CLIENT
            io.emit('NOT_IN_ROOM')
        }

    })
}

module.exports = attachSocketMethods
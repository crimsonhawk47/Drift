const pool = require('../modules/pool')
const moment = require('moment')
const attachSocketMethods = (socket, io, serverMethods) => {
    socket.on('test', data => {
        console.log(`IN TEST`);

    })

    socket.on('LOG_ME_OUT', data=>{
        console.log(`LOGGING USER OUT`);
        
        socket.disconnect();
    })

    socket.on('GET_MESSAGES', data=>{
        serverMethods.getChats(socket)
    })

    socket.on('CHANGE_AVATAR', data=>{
        let userId = socket.request.session.passport.user
        // console.log(socket);
        
        console.log(socket.rooms);
        
        
        let queryText = `UPDATE "user"
                        SET "image" = $1
                        WHERE "user".id = $2`
        pool.query(queryText, [data, userId])
        .then(result => {
            io.to(socket.id).emit('UPDATE_AVATAR')
            for (room in socket.rooms){
                if (socket.id !== room){
                io.to(room).emit('GET_MESSAGES')
                }
            }
        })
    })

    socket.on('SEND_MESSAGE', data => {
        let chatId = data.chatId
        let userId = socket.request.session.passport.user
        let message = data.input
        let socketIdSendingMessage = socket.id

        console.log(`-----------------`);
        console.log('THE TIME IS');
        console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
        
        
        console.log(userId);



        // console.log(`THIS SOCKET HAS THESE ROOMS`);
        // console.log(socket.rooms);
        if (socket.rooms.hasOwnProperty(chatId)) {

            let queryText = `INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
                            VALUES($1, $2, $3, NOW());`
            pool.query(queryText, [message, chatId, userId])
                .then(response => {
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
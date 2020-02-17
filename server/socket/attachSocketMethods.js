const pool = require('../modules/pool')
const moment = require('moment')
const attachSocketMethods = (socket, io, serverMethods) => {

    socket.on('LOG_ME_OUT', data => {
        console.log(`LOGGING USER OUT`);

        socket.disconnect();
    })

    socket.on('DELETE_MESSAGE', data => {
        console.log(`IN DELETE_MESSAGE`);

        let userId = socket.request.session.passport.user
        let room;
        //Grab the chat_id, which is synonymous with the room number
        pool.query(`SELECT "chat_id" FROM "messages"
        WHERE "messages".id = $1 AND "messages".user_id = $2`, [data, userId])
            .then(result => {
                //There should only be one result, with a column of chat_id. This is the room
                room = String(result.rows[0].chat_id)
                console.log('Setting Room to ', room);

                //If we actually got the room the message is from
                if (room) {
                    console.log(`About to DELETE`);
                    let queryText = `DELETE FROM "messages"
                                    WHERE "messages".id = $1 AND "messages".user_id = $2`
                    pool.query(queryText, [data, userId])
                        .then(result => {
                            console.log(result);
                            //After deleting the message, we tell everyone in the room to update
                            io.to(room).emit('GET_MESSAGES')

                        }).catch(err => {
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                console.log(err);
            })

    })

    socket.on('GET_MESSAGES', data => {
        //getChats sends all of the chats info needed to a socket
        serverMethods.getChats(socket)
    })

    socket.on('CHANGE_AVATAR', data => {
        let userId = socket.request.session.passport.user

        console.log(socket.rooms);


        let queryText = `UPDATE "user"
                        SET "image" = $1
                        WHERE "user".id = $2`
        pool.query(queryText, [data, userId])
            .then(result => {
                io.to(socket.id).emit('UPDATE_AVATAR')
                for (room in socket.rooms) {
                    if (socket.id !== room) {
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


        //The user will be sending the chatId from the client. We don't want to run any
        //of this unless the chatId being sent is actually a room that socket is in. 
        if (socket.rooms.hasOwnProperty(chatId)) {

            let queryText = `INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
                            VALUES($1, $2, $3, NOW());`
            pool.query(queryText, [message, chatId, userId])
                .then(response => {
                    //Tell the room that a message was sent
                    io.to(chatId).emit('NEW_MESSAGE')
                    let listOfAllSocketObjects = io.sockets
                    let currentRoomSocketNames = io.adapter.rooms[chatId].sockets

                    //For every socket connected to that room (should only be two)
                    //Roomsocket is a socket id...
                    for (roomSocket in currentRoomSocketNames) {
                        //...Index the list of sockets with the roomSocket ID...
                        let socketToUpdate = listOfAllSocketObjects[roomSocket]
                        //...And update that sockets methods
                        serverMethods.getChats(socketToUpdate)
                    }


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
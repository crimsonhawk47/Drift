const pool = require('../modules/pool')
const moment = require('moment')
const attachSocketMethods = (socket, io, serverMethods) => {

    socket.on('FIND_CHAT', function (data) {
        let userId = socket.request.session.passport.user

        const checkForOpenChats = async () => {
            let chatFound = false;
            let selectEmptyChatsQuery = `SELECT * FROM "chat" WHERE "user2" is NULL`
            //IF we dont await, the promise will happen before pool is finished
            await pool.query(selectEmptyChatsQuery)
                .then(async emptyChatsResult => {
                    //If it's an empty array, we will return it with Promise.resolve
                    if (!emptyChatsResult.rows.length) {
                        // console.log(result.rows);
                        chatFound = emptyChatsResult.rows
                    }
                    //If it was not an empty array, We will return the first chat found
                    else {
                        // console.log(result.rows);
                        let previousChatsText = `SELECT array_agg(
                                                CASE WHEN "user1" = $1 
                                                THEN "user2"
                                                ELSE "user1"
                                                END) as users
                                                FROM "chat"
                                                WHERE ("user1" = $1 OR "user2" = $1) 
                                                AND ("user2" IS NOT NULL AND "user1" IS NOT NULL)`

                        await pool.query(previousChatsText, [userId])
                            .then(previousChatsResult => {
                                let listOfPreviousChats = previousChatsResult.rows[0].users
                                console.log(listOfPreviousChats);

                                for (row of emptyChatsResult.rows) {
                                    console.log(row.user1);
                                    if (listOfPreviousChats.includes(row.user1)) {
                                        console.log(`Already have chatted with ${row.user1}`);
                                    }
                                    else {
                                        console.log(`HAVE NOT chatted with ${row.user1}`);
                                        chatFound = row.id
                                    }
                                }
                            })
                            .catch(err => {
                                console.log(err);

                            })

                    }

                })
                .catch(err => {
                    console.log(err);
                })

            return Promise.resolve(chatFound)
            // return chatFound

        }

        console.log(`--------START---------`);


        checkForOpenChats().then((result) => {

            if (Number.isInteger(result)) {
                let chatId = result
                console.log(`Updating chat number ${chatId} with "user2" of ${userId}`);

                pool.query(`UPDATE "chat"
                            SET "user2" = $1
                            WHERE "chat".id = $2
                            `, [userId, chatId])
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => {
                        console.log(err);

                    })

            }
            else if (Array.isArray(result)) {
                console.log('No Chat Found, starting new chat');
                

                let queryText = `INSERT INTO "chat"
                        ("user1", "user2", "active")
                        VALUES($1, NULL, TRUE)
                        RETURNING id`

                pool.query(queryText, [userId])
                    .then(result => { monitorChat(result) })
                    .catch(err => { console.log(err) })



                const monitorChat = async function (result) {
                    let id = result.rows[0].id
                    let chatFound = false;
                    for (let i = 0; i < 10; i++) {
                        console.log(i, ' seconds');
                        pool.query(`SELECT "user2" FROM "chat"
                                WHERE "id" = $1`, [id])
                            .then(result => {
                                let user2 = result.rows[0].user2
                                if (user2) {
                                    console.log(`YAYYYY, NOW WE HAVE ${user2}`);
                                    chatFound = true;
                                }
                                else {
                                    console.log(user2);
                                }
                            })
                            .catch(err => { console.log(err) })
                        if (chatFound) {
                            break;
                        }
                        if (socket.disconnected){
                            console.log(`User disconnected before a match could be found`);
                            break;   
                        }

                        const timer = ms => new Promise(res => setTimeout(res, ms));
                        await timer(1000)
                    }
                    if (chatFound) {
                        console.log(`YOU ARE CONNECTED`);
                    }
                    else {
                        pool.query(`DELETE FROM "chat"
                                    WHERE "id" = $1`, [id])
                    }
                }

            }
            else if (result === false) {
                console.log(`Something went wrong with the original pool.query`);

            }

            console.log(`returning anyway SHOULD RUN LAST`);

            return 1
        })






    })



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

        //Changing the avatar filepath
        let queryText = `UPDATE "user"
                        SET "image" = $1
                        WHERE "user".id = $2`
        pool.query(queryText, [data, userId])
            .then(result => {
                //Tell the user to update their avatar by calling getUser
                socket.emit('UPDATE_AVATAR')
                //Tell the specific socket that changed their avatar to update their messages
                socket.emit('GET_MESSAGES')
                //For every room that socket is in
                for (room in socket.rooms) {
                    //have everyone that isn't that socket update their messages
                    //Remember that the socket is in its own room as well, and it wont emit to itself
                    socket.to(room).emit('GET_MESSAGES')
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
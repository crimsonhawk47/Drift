const pool = require('../pool')


function getChats(socket) {
    let userId = socket.request.session.passport.user;

    // console.log(`Moment before getChats Query says ${moment().format('MMMM Do YYYY, h:mm:ss.SSS a')}`);

    //Selects messages and their users by chat and groups them into an array in one column
    let combineMessagesText = `SELECT "chat".id as "chat_id", jsonb_build_object('id', "messages".id, 'message', "messages".message, 'username', "user".username, 'date', "messages".date, 'img', "user".image) as message_details, "messages".id as "message_id" FROM "chat"
    JOIN "messages" ON "chat".id = "messages".chat_id
    JOIN "user" ON "user".id = "messages".user_id
    WHERE ("chat".user1 = $1 OR "chat".user2=$1)
    ORDER BY "messages".id`

    //Creates an array of chat objects with four properties: 
    //The chat id, an array of messages, and the user ID's of both participants
    let combineMessagesByChat = `SELECT "chat_id", "chat".start_date as "chat_date", jsonb_agg("foo".message_details ORDER BY foo."message_id") as chat_messages, "chat".user1, "chat".user2, "chat".active from (${combineMessagesText})
                                as foo
                                JOIN "chat" ON "chat_id" = "chat".id
                                GROUP BY "chat_id", "chat".user1, "chat".user2, "chat".active, "chat".start_date
                                `
    //Replaces the User ID's of both participants (in the last query) with their actual usernames
    //Also places both usernames in a single array
    let fillUsernames = `SELECT "chat_id", "chat_date", "chat_messages", array_agg("user".username) as participants, "goo".active FROM (${combineMessagesByChat})
                        as goo
                        JOIN "user" ON "user".id = "user1" OR "user".id = "user2"
                        GROUP BY "chat_id", "chat_messages", "goo".active, "goo".chat_date
                        ORDER BY "goo".active DESC, "goo".chat_date
                        `

    pool.query(fillUsernames, [Number(userId)])
        .then(response => {
            // console.log(`Moment after getChats query says ${moment().format('MMMM Do YYYY, h:mm:ss.SSS a')}`);

            //RECEIVE_ALL_CHATS is a socket event on the client that will put data into the chats reducer
            socket.emit('RECEIVE_ALL_CHATS', response.rows)
        }).catch(error => {
            console.log(error);
        })
}

module.exports = getChats
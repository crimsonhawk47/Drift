const pool = require('../modules/pool');

const findChat = (socket, io, serverMethods) => {

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
                        if (socket.disconnected) {
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

}


module.exports = findChat;
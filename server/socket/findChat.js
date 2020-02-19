const pool = require('../modules/pool');


const findChat = (socket, io, serverMethods) => {
  socket.on('FIND_CHAT', async function (data) {
    let userId = socket.request.session.passport.user
    console.log(`--------------START--------------`);
    //Returns an object with info on whether a chat was open or not
    try {
      const result = await checkForOpenChats(userId)
      //Handles all of the logic for potential open chats
      let chatResult = await handleOpenChat(result, userId, socket)
      if (chatResult) {
        console.log(`A chat was found`);

        socket.emit('CHAT_FOUND')
      }
      else {
        console.log(`no chat was found`);

        socket.emit('NO_CHAT_FOUND')
      }

    } catch (err) {
      socket.emit('ERROR_IN_FIND_CHAT', err)
      console.log(`error in find chat`);
      console.log(err);
    }

    console.log(`------------END------------`);

    return 1
  })
}


const checkForOpenChats = async (userId) => {
  let openChatId = false;
  let userToChatWith = 0;
  //Find all open chats
  let selectEmptyChatsQuery = `SELECT * FROM "chat" WHERE "user2" is NULL`
  try {
    const emptyChatsResult = await pool.query(selectEmptyChatsQuery)

    //If it was not an empty array, we will compare open chats to chats the user has had
    if (emptyChatsResult.rows.length) {
      //SELECTING A LIST OF CHATS OUR USER HAS ALREADY HAD
      let previousChatsText = `SELECT array_agg(
                            CASE WHEN "user1" = $1 
                            THEN "user2"
                            ELSE "user1"
                            END) as users
                            FROM "chat"
                            WHERE ("user1" = $1 OR "user2" = $1) 
                            AND ("user2" IS NOT NULL AND "user1" IS NOT NULL)`


      const previousChatsResult = await pool.query(previousChatsText, [userId])
      //This is just an array of chats the client has had
      let listOfPreviousChats = previousChatsResult.rows[0].users
      console.log(listOfPreviousChats);

      //Row will be an openChat instance from sql
      for (row of emptyChatsResult.rows) {
        //If the id of this open chat is in the list of previous chats
        //Don't do anything. Else, put the relevant info into variables
        if (listOfPreviousChats.includes(row.user1)) {
          console.log(`Already have chatted with ${row.user1}`);
        }
        else {
          console.log(`HAVE NOT chatted with ${row.user1}`);
          if (row.user1 !== userId) {
            openChatId = row.id
            userToChatWith = row.user1
            break;
          }
          else {
            console.log(`This is you though, You can't join a chat with yourself`);
          }

        }
      }
    }

    return Promise.resolve({ openChatId, userToChatWith })
  } catch (err) {
    return Promise.reject(err)
  }

}

const handleOpenChat = async (result, userId, socket) => {
  try {

    //If a user was actually found...
    if (result.openChatId) {
      //And that user isn't the same as the user making the request...
      console.log(`Updating chat number ${result.openChatId} with "user2" of ${userId}`);

      //...Join the user to the openChatId

      await joinChat(userId, result.openChatId);


    }

    //If no user was found, we will create a new chat
    else if (!result.openChatId) {
      console.log('No Chat Found, starting new chat');


      let queryText = `INSERT INTO "chat"
                ("user1", "user2", "active")
                VALUES($1, NULL, TRUE)
                RETURNING id`

      //We will create a new chat that will pass the info of the sql row to 
      //Monitor chat. This will check the sql row every second to see if the second user
      //was filled by something like joinChat from a second socket.
      let newlyOpenedChatResult = await pool.query(queryText, [userId])
      let chatMonitorResult = await monitorChat(newlyOpenedChatResult, socket)
      return Promise.resolve(chatMonitorResult);
    }

    else {
      return Promise.reject(`handleOpenChat had a weird else trigger [VERY BAD!!!!!!!]`);
    }

  } catch (err) {
    return Promise.reject(err)
  }


}




const monitorChat = async function (result, socket) {
  try {
    let pendingChatId = result.rows[0].id
    let chatFound = false;
    for (let i = 0; i < 10; i++) {

      let user2Result = await pool.query(`SELECT "user2" FROM "chat"
                                          WHERE "id" = $1`, [pendingChatId])
      let partnerStatus = user2Result.rows[0].user2
      if (partnerStatus) {
        console.log(`YAYYYY, NOW USER ${partnerStatus} IS JOINING`);
        chatFound = true;
      }

      if (socket.disconnected) {
        console.log(`User disconnected before a match could be found`);
        chatFound = false;
        break;
      }
      if (chatFound) {
        break;
      }
      console.log('waiting ', i, 'seconds');


      const timer = ms => new Promise(res => setTimeout(res, ms));
      await timer(1000)

    }
    if (chatFound) {
      console.log(`YOU ARE CONNECTED`);
      return Promise.resolve(true);

    }
    else {
      await pool.query(`DELETE FROM "chat"
                    WHERE "id" = $1`, [pendingChatId])
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}


const joinChat = async (userId, openChatId) => {
  try {
    await pool.query(`UPDATE "chat"
            SET "user2" = $1
            WHERE "chat".id = $2
            `, [userId, openChatId])
    console.log(`User ${userId} has joined room ${openChatId}`);
  } catch (err) { return Promise.reject(err) }
}


module.exports = findChat;
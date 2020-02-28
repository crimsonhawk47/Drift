const pool = require('../modules/pool')
const moment = require('moment')


const sendMessage = (socket, io, serverMethods) => {
  socket.on('SEND_MESSAGE', async data => {
    let chatId = data.chatId
    try {
      let isChatActive = await pool.query(`SELECT * FROM "chat"
                          WHERE "chat".id = $1`, [chatId])
      if (!isChatActive.rows[0].active) {
        return 0
      }
    } catch (err) {
      console.log(err);
      return err

    }
    let userId = socket.request.session.passport.user
    let message = data.input
    let socketIdSendingMessage = socket.id

    console.log(`-----------------`);
    console.log('THE TIME IS');
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));


    console.log(userId);
    console.log(socket.rooms);



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

module.exports = sendMessage  
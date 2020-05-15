const pool = require('../modules/pool')
const moment = require('moment')


const sendMessage = (socket, io, serverMethods) => {
  socket.on('SEND_MESSAGE', async data => {
    try {
      let chatId = data.chatId
      //Checks if the chat is actually still open
      await serverMethods.isChatActive(chatId)

      let userId = socket.request.session.passport.user
      let message = data.input
      let socketIdSendingMessage = socket.id

      console.log(`START-----------------------------------------`);
      console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
      console.log(`User Id of person Sending Message: #${userId}`);
      console.log(`--------Rooms this socket is in ----------`);
      console.log(socket.rooms);
      console.log(`------------------------------------------`);
      console.log(`END`);


      //The user will be sending the chatId from the client. We don't want to run any
      //of this unless the chatId being sent is actually a room that socket is in, otherwise
      //People could modify their client and post to any room. 
      if (socket.rooms.hasOwnProperty(chatId)) {

        const queryText = `INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
                        VALUES($1, $2, $3, NOW());`
        await pool.query(queryText, [message, chatId, userId])
        //Tell the room that a message was sent
        io.to(chatId).emit('NEW_MESSAGE')
        //Getting an array of sockets in the room. 
        const arrayOfSockets = serverMethods.getArrayOfSocketsInRoom(io, chatId)
        //Telling all sockets in the room to update chats. 
        for (socket of arrayOfSockets) {
          serverMethods.getChats(socket)
        }
      }
      else {
        //THIS SHOULD ONLY TRIGGER IF THE USER MODIFIED THEIR CLIENT
        io.emit('NOT_IN_ROOM')
      }
    } catch (err) {
      console.log(err);
      socket.emit(err)
    }

  })
}

module.exports = sendMessage  
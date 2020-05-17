const pool = require('../modules/pool')

const deleteMessage = (socket, io, serverMethods) => {

  socket.on('DELETE_MESSAGE', async data => {
    try {
      const chatId = data.chatId
      const userId = socket.request.session.passport.user
      //Check if chat is still active
      await serverMethods.isChatActive(chatId)
      //If the socket is really in that room
      if (socket.rooms.hasOwnProperty(chatId)) {
        //Delete the message, assuming the user actually owns the message
        let queryText = `DELETE FROM "messages"
        WHERE "messages".id = $1 AND "messages".user_id = $2`
        const deleteResult = await pool.query(queryText, [data.id, userId])
        //After deleting the message, we tell everyone in the room to update
        io.to(chatId).emit('GET_MESSAGES')
      }
      else throw (`The client's socket is not in the chat room provided by the client`)

    }
    catch (err) {
      console.log(err);
      socket.emit('ERROR', 'SERVER ERROR: Something went wrong with deleting your message')
    }
  })
}

module.exports = deleteMessage
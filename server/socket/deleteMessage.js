const pool = require('../modules/pool')

const deleteMessage = (socket, io, serverMethods) => {

  socket.on('DELETE_MESSAGE', async data => {
    try {
      const chatId = data.chatId
      const userId = socket.request.session.passport.user
      let room;
      await serverMethods.isChatActive(chatId)

      //Grab the chat_id, which is synonymous with the room number
      const result = await pool.query(`SELECT "chat_id" FROM "messages"
    WHERE "messages".id = $1 AND "messages".user_id = $2`, [data.id, userId])
      //There should only be one result, with a column of chat_id. This is the room
      room = String(result.rows[0].chat_id)
      console.log('Setting Room to ', room);

      //If we actually got the room the message is from
      if (room) {
        let queryText = `DELETE FROM "messages"
        WHERE "messages".id = $1 AND "messages".user_id = $2`
        const deleteResult = await pool.query(queryText, [data.id, userId])
        //After deleting the message, we tell everyone in the room to update
        io.to(room).emit('GET_MESSAGES')

      }
    }
    catch (err) {
      console.log(err);
      return err
    }
  })
}
module.exports = deleteMessage
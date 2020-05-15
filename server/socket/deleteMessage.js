const pool = require('../modules/pool')

const deleteMessage = (socket, io, serverMethods) => {

  socket.on('DELETE_MESSAGE', async data => {
    console.log(`IN DELETE_MESSAGE ${data}`);

    try {
      let isChatActive = await pool.query(`SELECT * FROM "chat"
                          WHERE "chat".id = $1`, [data.chatId])
      if (!isChatActive.rows[0].active) {
        return 0
      }
    } catch (err) {
      console.log(err);
      return err

    }

    let userId = socket.request.session.passport.user
    let room;
    //Grab the chat_id, which is synonymous with the room number
    pool.query(`SELECT "chat_id" FROM "messages"
                    WHERE "messages".id = $1 AND "messages".user_id = $2`, [data.id, userId])
      .then(result => {
        //There should only be one result, with a column of chat_id. This is the room
        room = String(result.rows[0].chat_id)
        console.log('Setting Room to ', room);

        //If we actually got the room the message is from
        if (room) {
          console.log(`About to DELETE`);
          let queryText = `DELETE FROM "messages"
                                WHERE "messages".id = $1 AND "messages".user_id = $2`
          pool.query(queryText, [data.id, userId])
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
}
module.exports = deleteMessage
const pool = require('../modules/pool')
const sendMessage = require('./sendMessageSocket')
const deleteMessage = require('./deleteMessageSocket')
const changeAvatar = require('./changeAvatarSocket')
const findChat = require('./findChat')
const moment = require('moment')
const attachSocketMethods = (socket, io, serverMethods) => {


  socket.on('LOG_ME_OUT', data => {
    console.log(`LOGGING USER OUT`);

    socket.disconnect();
  })



  socket.on('GET_MESSAGES', data => {
    //getChats sends all of the chats info needed to a socket
    serverMethods.getChats(socket)
  })

  socket.on('TEST_SLEEP', async data => {
    const timer = ms => new Promise(res => setTimeout(res, ms));
    

    let sum = 1;
    async function test() {
      for (let i = 1; i < 550000000; i++) {
        sum = sum * i;
        // await timer(1)
        // await new Promise(res => setTimeout(res, 1))
        // console.log(sum);

        // Promise.resolve(3)
        // await pool.query('select * from "messages"')
      }
      Promise.resolve(3)
    }
    let x = await test()
    console.log(`DONE`);


  })


  findChat(socket, io, serverMethods)
  changeAvatar(socket, io, serverMethods);
  deleteMessage(socket, io, serverMethods);
  sendMessage(socket, io, serverMethods);
}

module.exports = attachSocketMethods
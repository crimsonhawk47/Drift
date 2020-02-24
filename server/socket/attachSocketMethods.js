const pool = require('../modules/pool')
const sendMessage = require('./sendMessageSocket')
const deleteMessage = require('./deleteMessageSocket')
const changeAvatar = require('./changeAvatarSocket')
const findChat = require('./findChat')
const moment = require('moment')
let x = 0
const attachSocketMethods = (socket, io, serverMethods) => {


  socket.on('LOG_ME_OUT', data => {
    console.log(`LOGGING USER OUT`);

    socket.disconnect();
  })



  socket.on('GET_MESSAGES', async data => {
    //getChats sends all of the chats info needed to a socket
    serverMethods.getChats(socket)
  })


  socket.on('TEST_SLEEP', async data => {
    console.log(`this has run`, x, ` times`);
    x++

    // const timer = ms => new Promise(res => setTimeout(res, ms));

    const timer = () => {
      return new Promise(res => {
        {
          for (let i = 2; i < 450000000; i++) {
            sum = sum * i
          }
          console.log(`past for loop`);
          
          setTimeout(() => {res('did it')}, 3000)
        }
      });
    }

    let sum = 3;

    

    const test = async () => {
      // await Promise.resolve(3)
      let x = await timer()
      console.log(x);

    }

    await test();

    

    


    console.log(`---------DONE---------`);
  })

  socket.on('DEMO_INACTIVE', async function(data, f){
    console.log(`DEMO INACTIVE`);
    console.log(data);
    
    await pool.query(`UPDATE "chat"
                      SET "active" = NOT "active"
                      WHERE "id" = $1`, [data])
    f()
    
  })


  findChat(socket, io, serverMethods)
  changeAvatar(socket, io, serverMethods);
  deleteMessage(socket, io, serverMethods);
  sendMessage(socket, io, serverMethods);
}

module.exports = attachSocketMethods
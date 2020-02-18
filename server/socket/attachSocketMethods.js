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


    findChat(socket, io, serverMethods)
    changeAvatar(socket, io, serverMethods);
    deleteMessage(socket, io, serverMethods);
    sendMessage(socket, io, serverMethods);
}

module.exports = attachSocketMethods
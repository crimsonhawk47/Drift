const pool = require('../modules/pool')
const sendMessage = require('./sendMessageSocket')
const deleteMessage = require('./deleteMessageSocket')
const changeAvatar = require('./changeAvatarSocket')
const findChat = require('./findChat')
const moment = require('moment')
let x = 0
const attachSocketMethods = (socket, io, serverMethods) => {


  findChat(socket, io, serverMethods)
  changeAvatar(socket, io, serverMethods);
  deleteMessage(socket, io, serverMethods);
  sendMessage(socket, io, serverMethods);
}

module.exports = attachSocketMethods
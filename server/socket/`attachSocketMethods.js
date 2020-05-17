const sendMessage = require('./sendMessage')
const deleteMessage = require('./deleteMessage')
const changeAvatar = require('./changeAvatar')
const findChat = require('./findChat')
const getMessages = require('./getMessages')
const logMeOut = require('./logMeOut')
const attachSocketMethods = (socket, io, serverMethods) => {


  changeAvatar(socket, io, serverMethods);
  deleteMessage(socket, io, serverMethods);
  findChat(socket, io, serverMethods)
  getMessages(socket, io, serverMethods);
  logMeOut(socket, io, serverMethods);
  sendMessage(socket, io, serverMethods, 3);
}

module.exports = attachSocketMethods
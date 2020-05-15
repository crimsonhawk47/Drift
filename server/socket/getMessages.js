const getMessages = (socket, io, serverMethods) => {
    socket.on(`GET_MESSAGES`, async data => {
        serverMethods.getChats(socket)
    })
}

module.exports = getMessages
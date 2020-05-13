const getMessages = (socket, io, serverMethods) => {
    console.log(`In GetMessages`);
    
    socket.on(`GET_MESSAGES`, async data => {
        serverMethods.getChats(socket)
    })
}

module.exports = getMessages
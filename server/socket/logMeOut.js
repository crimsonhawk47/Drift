

const logMeOut = (socket, io, serverMethods) => {
    socket.on('LOG_ME_OUT', async data => {
        console.log(`Logging User Out`);
        socket.disconnect();
    })
}

module.exports = logMeOut
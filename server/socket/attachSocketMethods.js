const attachSocketMethods = (socket) => {
    socket.on('test', data=>{
        console.log(`IN TEST`);
        
      })
}

module.exports = attachSocketMethods
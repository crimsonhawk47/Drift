const attachSocketMethods = (socket) => {
    socket.on('test', data=>{
        console.log(`IN TEST`);
        
      })

    socket.on('SEND_MESSAGE', data => {
        console.log(data);
        
    })
}

module.exports = attachSocketMethods
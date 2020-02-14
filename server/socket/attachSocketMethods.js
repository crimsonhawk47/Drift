const attachSocketMethods = (socket, io, serverMethods) => {
    socket.on('test', data=>{
        console.log(`IN TEST`);
        
      })

    socket.on('SEND_MESSAGE', data => {
        let chatId = data.chatId
        let message = data.input
        let socketIdSendingMessage = socket.id
        
        console.log(`-----------------`);
        
        // console.log(`THIS SOCKET HAS THESE ROOMS`);
        // console.log(socket.rooms);
        if (socket.rooms.hasOwnProperty(chatId)) {
            // console.log(`THE USER IS IN THIS ROOM, WE CAN SEND A MESSAGE`);
            io.to(chatId).emit('NEW_MESSAGE')
            // console.log(io.sockets[socket.id]);
            let listOfAllSocketObjects = io.sockets
            let currentRoomSocketNames = io.adapter.rooms[chatId].sockets
            // console.log(io);
            

            for (roomSocket in currentRoomSocketNames){
                // console.log(listOfAllSocketObjects[roomSocket]);
                serverMethods.getChats(listOfAllSocketObjects[roomSocket])

                
                
            }
            
            // serverMethods.getChats(socketThatSentMEssage)
            
        }
        else{
            //THIS SHOULD ONLY TRIGGER IF THE USER MODIFIED THEIR CLIENT
            io.emit('NOT_IN_ROOM')
        }
        
    })
}

module.exports = attachSocketMethods
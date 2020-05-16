

function getArrayOfSocketsInRoom(io, roomName) {

    //Get an object of all sockets, which can be indexed by name/key
    const listOfAllSocketObjects = io.sockets
    //Get an object  of the names/keys of sockets in a specific room. We are indexing by the room name. 
    const namesOfSocketsInRoom = io.adapter.rooms[roomName].sockets
    const arrayOfSockets = []
    for (socketName in namesOfSocketsInRoom) {
        //Get the actual socket object by name
        const socketToAdd = listOfAllSocketObjects[socketName]
        arrayOfSockets.push(socketToAdd)
    }
    return arrayOfSockets
}

module.exports = getArrayOfSocketsInRoom
const pool = require('../modules/pool')

const changeAvatar = (socket, io, serverMethods) => {

    socket.on('CHANGE_AVATAR', data => {
        let userId = socket.request.session.passport.user

        console.log(socket.rooms);

        //Changing the avatar filepath
        let queryText = `UPDATE "user"
                        SET "image" = $1
                        WHERE "user".id = $2`
        pool.query(queryText, [data, userId])
            .then(result => {
                //Tell the user to update their avatar by calling getUser
                socket.emit('UPDATE_AVATAR')
                //Tell the specific socket that changed their avatar to update their messages
                socket.emit('GET_MESSAGES')
                //For every room that socket is in
                for (room in socket.rooms) {
                    //have everyone that isn't that socket update their messages
                    //Remember that the socket is in its own room as well, and it wont emit to itself
                    socket.to(room).emit('GET_MESSAGES')
                }
            })
    })

}

module.exports = changeAvatar

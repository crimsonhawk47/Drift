import store from './store'

import io from 'socket.io-client'



const setupSocket = () => {

    const socket = io();

    socket.on('RECEIVE_ALL_CHATS', (data) => {
        console.log(`LOGGING DATA`);
        console.log(data);
        //Logging the socket message in the messages reducer
        store.dispatch({ type: 'SET_ALL_CHATS', payload: data })
    })

}

export default setupSocket
import store from './store'

import io from 'socket.io-client'

let socket;



const setupSocket = () => {
    let innerSocket = io('localhost:5000');

    innerSocket.on('RECEIVE_ALL_CHATS', (data) => {
        console.log(`LOGGING DATA`);
        console.log(data);
        //Logging the socket message in the messages reducer
        store.dispatch({ type: 'SET_ALL_CHATS', payload: data })
    })

    socket = innerSocket

}

export {setupSocket, socket}
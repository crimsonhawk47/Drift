import store from './store'

import io from 'socket.io-client'

let socket;


//We need socket to not try to connect until we have the cookie. The server will reject us
//Without the cookie. We also need to export socket once it's working. So for now, it's undefined
//until setupSocket is called from 
const setupSocket = () => {


    if (!socket || socket.disconnected) {
        let innerSocket = io('localhost:5000');

        innerSocket.on('RECEIVE_ALL_CHATS', (data) => {
            // console.log(`LOGGING DATA`);
            // console.log(data);
            //Logging the socket message in the messages reducer
            store.dispatch({ type: 'SET_ALL_CHATS', payload: data })
        })
        innerSocket.on('TEST', (data) => {
            console.log(`I'M IN A ROOM, LIKE ${data}`);

        })

        innerSocket.on('NOT_IN_ROOM', (data) => {
            console.log(`You are not in this chat room`);

        })
        innerSocket.on('NEW_MESSAGE', () => {
            console.log(`SOMEONE IN YOUR ROOM SENT A MESSAGE`);

        })
        innerSocket.on('UPDATE_AVATAR', ()=>{
            store.dispatch({type: 'FETCH_USER'})
        })
        innerSocket.on('GET_MESSAGES', ()=>{
            store.dispatch({type: 'GET_MESSAGES'})
        })
        socket = innerSocket
    }


}

export { setupSocket, socket }
import store from './store'

import io from 'socket.io-client'

let socket;


//We need socket to not try to connect until we have the cookie. The server will reject us
//Without the cookie. We also need to export socket once it's working. So for now, it's undefined
//until setupSocket is called from 
const setupSocket = () => {
    if (!socket) {
        let innerSocket = io('localhost:5000');

        innerSocket.on('RECEIVE_ALL_CHATS', (data) => {
            // console.log(`LOGGING DATA`);
            // console.log(data);
            //Logging the socket message in the messages reducer
            store.dispatch({ type: 'SET_ALL_CHATS', payload: data })
        })
        innerSocket.on('TEST', (data)=>{
            console.log(`I'M IN A ROOM, LIKE ${data}`);
            
        })
        socket = innerSocket
    }


}

export { setupSocket, socket }
import store from './store'

import io from 'socket.io-client'

import url from 'url';
// const params = url.parse(process.env.DATABASE_URL);

// const host = params.hostname
// const port = params.port



let socket;


//We need socket to not try to connect until we have the cookie. The server will reject us
//Without the cookie. We also need this socket in other files, and we need it to not
//setup multiple times. 
const setupSocket = () => {

  //Since this setupSocket function is in a fetch_user saga, which will happen anytime we need
  //To update our user info, we only want it running when the socket either never existed,
  //or is disconnected on an event like logout. So we either check for undefined or 
  //True on the disconnected property of the socket
  if (!socket || socket.disconnected) {

    //Making a socket connection, which will eventually be passed to the socket
    //variable on the outside
    let innerSocket = io();

    //Takes the data it receives and puts it in the chats reducer
    innerSocket.on('RECEIVE_ALL_CHATS', (data) => {
      store.dispatch({ type: 'SET_ALL_CHATS', payload: data })
    })

    innerSocket.on('ERROR', (data) => {
      console.error(data)
      alert(data)
    })

    //Should only trigger if client is modified
    innerSocket.on('NOT_IN_ROOM', (data) => {
      console.log(`You are not in this chat room`);
    })

    //Happens when someone in your room sends 'SEND_MESSAGE' to the server
    innerSocket.on('NEW_MESSAGE', () => {
      console.log(`SOMEONE IN YOUR ROOM SENT A MESSAGE`);
    })

    //Happens when you update your avatar
    innerSocket.on('UPDATE_AVATAR', () => {
      store.dispatch({ type: 'FETCH_USER' })
    })

    //Happens when the server tells you that you need to update your chats
    //Different from RECEIVE_ALL_CHATS. This will start the process to get to RECEIVE_ALL_CHATS
    innerSocket.on('GET_MESSAGES', () => {
      store.dispatch({ type: 'GET_MESSAGES' })
    })


    innerSocket.on('NOT_LOGGED_IN', () => {
      console.log(`YOU DONT APPEAR TO BE LOGGED IN ANYMORE`);

    })

    //Sets the outside socket, which we will export, to this innerSocket.
    socket = innerSocket
  }
}

export { setupSocket, socket }
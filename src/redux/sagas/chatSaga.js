import { put, takeLatest } from 'redux-saga/effects';
import {socket} from '../socket'

function* sendMessage(action){
    yield socket.emit('SEND_MESSAGE', action.payload)
}

function* getMessages(action){
    yield socket.emit('GET_MESSAGES', action.payload)
}

function* deleteMessage(action){
    yield socket.emit('DELETE_MESSAGE', action.payload)
}

function* chatSaga() {
    yield takeLatest('SEND_MESSAGE', sendMessage);
    yield takeLatest('GET_MESSAGES', getMessages);
    yield takeLatest('DELETE_MESSAGE', deleteMessage)
  }
  
  export default chatSaga;

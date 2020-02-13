import { put, takeLatest } from 'redux-saga/effects';
import {socket} from '../socket'

function* sendMessage(action){
    yield socket.emit('SEND_MESSAGE', action.payload)
}


function* chatSaga() {
    yield takeLatest('SEND_MESSAGE', sendMessage);
  }
  
  export default chatSaga;

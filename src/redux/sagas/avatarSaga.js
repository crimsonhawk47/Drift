import { put, takeLatest } from 'redux-saga/effects';
import {socket} from '../socket'

function* sendMessage(action){
    yield socket.emit('CHANGE_AVATAR', action.payload)
}


function* avatarSaga() {
    yield takeLatest('CHANGE_AVATAR', sendMessage);
  }
  
  export default avatarSaga;
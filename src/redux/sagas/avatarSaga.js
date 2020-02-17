import { put, takeLatest } from 'redux-saga/effects';
import {socket} from '../socket'

function* changeAvatar(action){
    yield socket.emit('CHANGE_AVATAR', action.payload)
}


function* avatarSaga() {
    yield takeLatest('CHANGE_AVATAR', changeAvatar);
  }
  
  export default avatarSaga;
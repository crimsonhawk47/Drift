import { put, takeLatest } from 'redux-saga/effects';
import store from '../store'
import { socket } from '../socket'

function* sendMessage(action) {
  yield socket.emit('SEND_MESSAGE', action.payload)
}

function* getMessages(action) {
  yield socket.emit('GET_MESSAGES', action.payload)
}

function* deleteMessage(action) {
  yield socket.emit('DELETE_MESSAGE', action.payload)
}

function* findChat() {
  yield socket.emit('FIND_CHAT', function (chatId) {
    store.dispatch({ type: 'GET_MESSAGES' })
  })
}

function* chatSaga() {
  yield takeLatest('SEND_MESSAGE', sendMessage);
  yield takeLatest('GET_MESSAGES', getMessages);
  yield takeLatest('DELETE_MESSAGE', deleteMessage)
  yield takeLatest('FIND_CHAT', findChat)
}

export default chatSaga;

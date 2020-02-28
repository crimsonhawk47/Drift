import allChats from './chatsReducer'

describe('Testing Chats Reducer', () => {
  test('Chats Reducer works!', () => {
    let state = [];
    let string = 'YASSQUEEEEN'
    let action = { type: 'SET_ALL_CHATS', payload: string }
    let returnedState = allChats(state, action);
    expect(returnedState).toBe(string)
  })

  test('Chats is default', () => {
    let state = [];
    let string = 'YASSQUEEEEN'
    let action = { payload: string }
    let returnedState = allChats(state, action);
    expect(returnedState).toBe(state)
  })
})

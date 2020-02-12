import { combineReducers } from 'redux';

const allChats = (state = [], action) =>{
    if (action.type === `SET_ALL_CHATS`){
        return action.payload;
    }
    else{
        return state
    }
}

export default allChats

import {combineReducers } from "redux";
import socketReducer from './chatting';
import loginReducer from './login'


const rootReducer = combineReducers({
    socketReducer,
    loginReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;